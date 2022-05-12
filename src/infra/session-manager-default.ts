import { Session } from "../application/session";
import { SessionManager } from "../application/session-manager";
import { SessionStore } from "../application/session-store";
import { UUIDGenerator } from "../application/uuid-generator";
import { User } from "../domain/model/user";
import { UserRepository } from "../domain/repository/user";
import { TokenGenerator } from "./token-generator";

export class SessionManagerDefault implements SessionManager {
    constructor(
        private tokenGenerator: TokenGenerator,
        private sessionStore: SessionStore,
        private uuidGenerator: UUIDGenerator,
        private userRepository: UserRepository
    ) {}

    async getUser(token: string): Promise<User | null> {
        let session = await this.get(token);
        if (!session) {
            throw new Error("Session not founded");
        }

        return await this.userRepository.findByUserID(session.userId);
    }

    async start(user: User): Promise<{ token: string; session: Session }> {
        let id = this.uuidGenerator.generate();
        let userId = user.userID;
        let session = new Session(
            id,
            userId,
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        );

        await this.sessionStore.create(session);
        let token = this.tokenGenerator.generate(id);

        return {
            token,
            session,
        };
    }

    generateToken(session: Session): string {
        return this.tokenGenerator.generate(session.id);
    }

    async get(token: string): Promise<Session | null> {
        let id = this.tokenGenerator.parse(token);
        let session = await this.sessionStore.find(id);

        

        if (!session) {
            return null;
        }

        if (session.expiration.getTime() < (new Date()).getTime()) {
            return null;
        }

        return session;
    }

    async close(session: Session): Promise<void> {
        await this.sessionStore.delete(session);
    }
}
