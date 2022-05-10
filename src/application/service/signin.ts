import { Username } from "../../domain/model/username";
import { UserRepository } from "../../domain/repository/user";
import { HashGenerator } from "../hash-generator";
import { SessionManager } from "../session-manager";

export type LoginDTO = {
    username: string;
    password: string;
};

export class SigninService {
    constructor(
        private hashGenerator: HashGenerator,
        private userRepository: UserRepository,
        private sessionManager: SessionManager
    ) {}

    async handle(loginData: LoginDTO): Promise<string> {
        let username = new Username(loginData.username);
        let user = await this.userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundError();
        }

        if (
            !this.hashGenerator.verify(
                loginData.password,
                user.passwordHash.passwordHash
            )
        ) {
            throw new WrongPasswordError();
        }

        let { token } = await this.sessionManager.start(user);

        return token;
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("User not funded.");
    }
}

export class WrongPasswordError extends Error {
    constructor() {
        super("Wrong password.");
    }
}
