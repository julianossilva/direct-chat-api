import _ from "lodash";
import { Session } from "./session";
import { SessionStore } from "./session-store";

export class SessionStoreInMemory implements SessionStore {
    sessions: Session[] = [];

    async create(session: Session): Promise<void> {
        this.sessions.push(_.cloneDeep(session));
    }
    async delete(session: Session): Promise<void> {
        this.sessions.filter((e) => e.id != session.id);
    }
    async find(id: string): Promise<Session | null> {
        let session = this.sessions.find((e) => e.id == id);
        if (!session) {
            return null;
        }
        return _.cloneDeep(session);
    }
}
