import { Client } from "pg";

export async function createMigrationsTableIfNotExist(client: Client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations_history (
            migration_name VARCHAR(255),
            running_date TIMESTAMP DEFAULT Current_timestamp
        );
    `);
}
