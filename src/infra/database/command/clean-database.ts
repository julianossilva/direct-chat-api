import { Pool } from "pg";

export class CleanDatabase {
    constructor(private pool: Pool) {}
    async run() {
        await this.pool.query("TRUNCATE TABLE users");
        await this.pool.query("TRUNCATE TABLE sessions");
    }
}
