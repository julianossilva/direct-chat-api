import dotenv from "dotenv";
import { Name } from "../../domain/model/name";
import { PasswordHash } from "../../domain/model/password-hash";
import { User } from "../../domain/model/user";
import { UserID } from "../../domain/model/user-id";
import { Username } from "../../domain/model/username";
import { UserRepositoryUnimplementedMock } from "../../domain/repository/user";
import { HashGeneratorUnimplementedMock } from "../hash-generator";
import { Session } from "../session";
import { SessionManagerUnimplementedMock } from "../session-manager";
import { SigninService } from "./signin";

dotenv.config();

test("Success signin", async () => {
    let hashGenerator = new (class extends HashGeneratorUnimplementedMock {
        async verify(password: string, hash: string): Promise<boolean> {
            return true;
        }
    })();
    let userRepository = new (class extends UserRepositoryUnimplementedMock {
        async findByUsername(username: Username): Promise<User | null> {
            return new User(
                new UserID("9e9a8c2e-63f7-4302-b4ee-6fc8b2a7ab96"),
                new Username("juliano"),
                new PasswordHash("shhhhh"),
                new Name("Juliano")
            );
        }
    })();
    let sessionManager = new (class extends SessionManagerUnimplementedMock {
        async start(user: User): Promise<{ token: string; session: Session }> {
            return {
                token: "1234.qwert",
                session: new Session(
                    "9371e422-294a-4adb-895b-90ea6520f460",
                    new UserID(""),
                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                ),
            };
        }
    })();

    let signinService = new SigninService(
        hashGenerator,
        userRepository,
        sessionManager
    );
    let token = await signinService.handle({
        username: "myusername",
        password: "mypassword",
    });

    expect(token).toBe("1234.qwert");
});
