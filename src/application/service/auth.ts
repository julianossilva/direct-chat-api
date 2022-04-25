import { Name } from "../../domain/model/name";
import { PasswordHash } from "../../domain/model/password-hash";
import { User } from "../../domain/model/user";
import { UserID } from "../../domain/model/user-id";
import { Username } from "../../domain/model/username";
import { UserRepository } from "../../domain/repository/user";
import { HashGeneratorBcrypt } from "../hash-generator-bcript";
import { UUIDGenerator } from "../uuid-generator";

export type NewUserDTO = {
    username: string,
    password: string,
    name: string,
}

export class AuthService {

    constructor(
        private hashGenerator: HashGeneratorBcrypt,
        private uuidGenerator: UUIDGenerator,
        private userRepository: UserRepository,
    ) { }

    async register(userData: NewUserDTO): Promise<void> {
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
}
