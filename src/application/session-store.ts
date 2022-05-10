import _ from "lodash";
import { Session } from "./session";

export interface SessionStore {
    create(session: Session): Promise<void>;
    delete(session: Session): Promise<void>;
    find(id: string): Promise<Session | null>;
}
