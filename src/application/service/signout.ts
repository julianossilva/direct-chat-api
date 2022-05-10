import { SessionManager } from "../session-manager";

export class SignoutService {
    constructor(private sessionManager: SessionManager) {}

    async handle(token: string): Promise<void> {
        let session = await this.sessionManager.get(token);
        if (!session) {
            throw new UnauthenticatedUserError();
        }
        await this.sessionManager.close(session);
    }
}

export class UnauthenticatedUserError extends Error {
    constructor() {
        super("User unauthemticated.");
    }
}
