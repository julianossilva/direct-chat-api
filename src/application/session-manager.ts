import { User } from "../domain/model/user";
import { Session } from "./session";

export interface SessionManager {
    get(token: string): Promise<Session | null>; //list
    getUser(token: string): Promise<User | null>;
    close(session: Session): Promise<void>; //delete
    start(user: User): Promise<{ token: string; session: Session }>; //create
    generateToken(session: Session): string;
}
