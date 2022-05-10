import { UserRepository } from "../../domain/repository/user";
import { SessionManager } from "../session-manager";

export type UserDataDTO = {
    username: string;
    name: string;
};

export class UserDataService {
    constructor(
        private userRepository: UserRepository,
        private sessionManager: SessionManager
    ) {}

    async handle(token: string): Promise<UserDataDTO> {
        let user = await this.sessionManager.getUser(token);

        if (!user) {
            throw new UnauthenticatedUserError();
        }

        return {
            username: user.username.username,
            name: user.name.name,
        };
    }
}
export class UnauthenticatedUserError extends Error {
    constructor() {
        super("unauthenticated user");
    }
}
