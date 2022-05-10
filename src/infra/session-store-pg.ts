import { Session } from "../application/session";
import { SessionStore } from "../application/session-store";
import { UserID } from "../domain/model/user-id";
import { LazyTransactionalClientPG } from "./database/lazy-client-pg";

export class SessionStorePG implements SessionStore {
    constructor(private lazyClient: LazyTransactionalClientPG) {}
    async create(session: Session): Promise<void> {
        await this.lazyClient.query(
            "INSERT INTO sessions (id, user_id, expiration) VALUES ($1, $2, $3);",
            [session.id, session.userId.uuid, session.expiration]
        );
    }
    async delete(session: Session): Promise<void> {
        await this.lazyClient.query("DELETE FROM sessions WHERE id=$1;", [
            session.id,
        ]);
    }
    async find(id: string): Promise<Session | null> {
        let res = await this.lazyClient.query(
            "SELECT id, user_id, expiration FROM sessions WHERE id=$1;",
            [id]
        );

        if (res.rows.length == 0) {
            return null;
        }

        return new Session(
            String(res.rows[0].id),
            new UserID(String(res.rows[0].user_id)),
            new Date(res.rows[0].expiration)
        );
    }
}
