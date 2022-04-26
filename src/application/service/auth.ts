import { Name } from "../../domain/model/name";
import { PasswordHash } from "../../domain/model/password-hash";
import { User } from "../../domain/model/user";
import { UserID } from "../../domain/model/user-id";
import { Username } from "../../domain/model/username";
import { UserRepository } from "../../domain/repository/user";
import { HashGenerator } from "../hash-generator";
import { Session } from "../session-manager";
import { UUIDGenerator } from "../uuid-generator";

export type NewUserDTO = {
    username: string,
    password: string,
    name: string,
}

export type LoginDTO = {
    username: string,
    password: string,
}

export class AuthService {

    constructor(
        private hashGenerator: HashGeneratorBcrypt,
        private uuidGenerator: UUIDGenerator,
        private userRepository: UserRepository,
    ) { }

    async signup(userData: NewUserDTO): Promise<void> {

        let username = new Username(userData.username);
        let name = new Name(userData.name);
        let passwordHash = new PasswordHash(await this.hashGenerator.generate(userData.password));
        let userID = new UserID(this.uuidGenerator.generate());

        let user = new User(
            userID,
            username,
            passwordHash,
            name,
        );

        await this.userRepository.create(user);
    }

    async signin(loginData: LoginDTO, session: Session): Promise<void> {
        if (await session.isStarted()) {
            throw new UserAlreadyAuthenticatedError();
        }

        let username = new Username(loginData.username);
        let user = await this.userRepository.findByUsername(username);

        if (user == null) {
            throw new UserNotFoundError();
        }

        if (!this.hashGenerator.verify(loginData.password, user.passwordHash.passwordHash)) {
            throw new WrongPasswordError();
        }

        session.start(user);
    }

    async signout(session: Session): Promise<void> {
        if (!await session.isStarted()) {
            throw new UnauthenticatedUserError();
        }

        session.close();
    }
}

export class UnauthenticatedUserError extends Error {
    constructor() {
        super("User unauthemticated.");
    }
}

export class UserAlreadyAuthenticatedError extends Error {
    constructor() {
        super("User already authenticated.");
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