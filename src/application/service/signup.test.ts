import dotenv from "dotenv";
import { User } from "../../domain/model/user";
import { UserRepositoryUnimplementedMock } from "../../domain/repository/user";
import { HashGeneratorUnimplementedMock } from "../hash-generator";
import { UUIDGeneratorUnimplementedMock } from "../uuid-generator";
import { SignupService } from "./signup";

dotenv.config();

beforeEach(async () => {});

test("Success signup", async () => {
    let hashGenerator = new (class extends HashGeneratorUnimplementedMock {
        async generate(password: string): Promise<string> {
            return `hash(${password})`;
        }
    })();
    let uuidGenerator = new (class extends UUIDGeneratorUnimplementedMock {
        generate(): string {
            return "6e794f35-8198-42e3-83e2-0c76cc1dd3e8";
        }
    })();
    let userRepository = new (class extends UserRepositoryUnimplementedMock {
        users: User[] = [];
        async create(user: User): Promise<void> {
            this.users.push(user);
        }
    })();

    let signupService = new SignupService(
        hashGenerator,
        uuidGenerator,
        userRepository
    );

    await signupService.handle({
        username: "juliano",
        password: "12345678",
        name: "Juliano Silva",
    });

    expect(userRepository.users.length).toBe(1);
    expect(userRepository.users[0].userID.uuid).toBe(
        "6e794f35-8198-42e3-83e2-0c76cc1dd3e8"
    );
    expect(userRepository.users[0].username.username).toBe("juliano");
    expect(userRepository.users[0].passwordHash.passwordHash).toBe(
        "hash(12345678)"
    );
});
