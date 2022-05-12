import { Name } from "../../domain/model/name";
import { PasswordHash } from "../../domain/model/password-hash";
import { User } from "../../domain/model/user";
import { UserID } from "../../domain/model/user-id";
import { Username } from "../../domain/model/username";
import { UserRepository } from "../../domain/repository/user";
import { HashGenerator } from "../hash-generator";
import { SessionManager } from "../session-manager";
import { UUIDGenerator } from "../uuid-generator";

export type NewUserDTO = {
    username: string;
    password: string;
    name: string;
};

export class SignupService {
    constructor(
        private hashGenerator: HashGenerator,
        private uuidGenerator: UUIDGenerator,
        private userRepository: UserRepository
    ) {}

    async handle(userData: NewUserDTO): Promise<void> {
        let username = new Username(userData.username);
        let name = new Name(userData.name);
        let passwordHash = new PasswordHash(
            await this.hashGenerator.generate(userData.password)
        );
        let userID = new UserID(this.uuidGenerator.generate());

        let user = new User(userID, username, passwordHash, name);

        await this.userRepository.create(user);
    }
}
