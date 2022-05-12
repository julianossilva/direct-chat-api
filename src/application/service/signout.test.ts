import dotenv from "dotenv";
import { UserID } from "../../domain/model/user-id";
import { Session } from "../session";
import { SessionManagerUnimplementedMock } from "../session-manager";
import { SignoutService } from "./signout";

dotenv.config();

test("Success signout", async () => {
    let sessionManager = new (class extends SessionManagerUnimplementedMock {
        closed = false;

        async close(session: Session): Promise<void> {
            this.closed = true;
        }

        async get(token: string): Promise<Session | null> {
            return new Session(
                "eeb8d63c-6581-4391-b050-eb4eb9d4ca6a",
                new UserID("9371e422-294a-4adb-895b-90ea6520f460"),
                new Date(Date.now() + 24 * 60 * 60 * 1000)
            );
        }
    })();

    let signoutService = new SignoutService(sessionManager);
    await signoutService.handle("abcd");

    expect(sessionManager.closed).toBe(true);
});
