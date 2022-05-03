import path from "path";
import fs from "fs";
import { Client } from "pg";

const MIGRATIONS_DIR_NAME = "migrations";

export class RollbackMigrations {
    async run() {
        let client = new Client({
            host: process.env.HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        client.connect();

        let migrationsBaseDir = path.resolve(
            process.cwd(),
            MIGRATIONS_DIR_NAME
        );

        let migrations = fs.readdirSync(migrationsBaseDir).reverse();

        for (let migration of migrations) {
            let alreadyApplyed =
                (
                    await client.query(
                        "SELECT * FROM migrations_history WHERE migration_name=$1",
                        [migration]
                    )
                ).rows.length > 0;

            let query = fs
                .readFileSync(
                    path.resolve(migrationsBaseDir, migration, "down.sql")
                )
                .toString();

            if (alreadyApplyed) {
                await client.query(query);
                await client.query(
                    "DELETE FROM migrations_history WHERE migration_name=$1",
                    [migration]
                );
                console.log(`migration ${migration} unapplyed.`);
            } else {
                console.log(`migration ${migration} already unapplyed.`);
            }
        }

        await client.end();

        console.log("All migrations unapplyed.");
    }
}
