import { Name } from "../../domain/model/name";
import { PasswordHash } from "../../domain/model/password-hash";
import { User } from "../../domain/model/user";
import { UserID } from "../../domain/model/user-id";
import { Username } from "../../domain/model/username";
import { UserRepository } from "../../domain/repository/user";
import { HashGeneratorBcrypt } from "../hash-generator-bcript";
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
        try {
            let username = Username.create(userData.username);
            let name = Name.create(userData.name);
            let passwordHash = PasswordHash.create(await this.hashGenerator.generate(userData.password));
            let userID = UserID.create(this.uuidGenerator.generate());

            let user = User.create(
                userID,
                username,
                passwordHash,
                name,
            );

            await this.userRepository.create(user);
        } catch (error) {
            throw error;
        }
    }

    async signin(loginData: LoginDTO, session: Session): Promise<void> {
        try {
            if (await session.isStarted()) {
                throw new Error("");
            }

            let username = Username.create(loginData.username);
            let user = await this.userRepository.findByUsername(username);

            if (user == null) {
                throw new Error("");
            }

            if (!this.hashGenerator.verify(loginData.password, user.passwordHash.passwordHash)) {
                throw new Error("");
            }

            session.start(user);

        } catch (error) {
            throw error;
        }
    }

    async signout(session: Session): Promise<void> {
        try {
            session.close();
        } catch (error) {
            throw error;
        }
    }
}
