import { User } from "../domain/model/user";
import { Session } from "./session";

export interface SessionManager {
    get(token: string): Promise<Session | null>; //list
    getUser(token: string): Promise<User | null>;
    close(session: Session): Promise<void>; //delete
    start(user: User): Promise<{ token: string; session: Session }>; //create
    generateToken(session: Session): string;
}

export class SessionManagerUnimplementedMock implements SessionManager {
    get(token: string): Promise<Session | null> {
        throw new Error("Method not implemented.");
    }
    getUser(token: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    close(session: Session): Promise<void> {
        throw new Error("Method not implemented.");
    }
    start(user: User): Promise<{ token: string; session: Session }> {
        throw new Error("Method not implemented.");
    }
    generateToken(session: Session): string {
        throw new Error("Method not implemented.");
    }
}
