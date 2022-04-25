import { User } from "../domain/model/user";

export interface Session {
    close(): Promise<void>;
    isStarted(): Promise<boolean>;
    start(user: User): Promise<void>;
}