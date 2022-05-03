import path from "path";
import fs from "fs";
import { Client } from "pg";
import { createMigrationsTableIfNotExist } from "../utils";

const MIGRATIONS_DIR_NAME = "migrations";

export class RunMigrations {
    async run() {
        let client = new Client({
            host: process.env.HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        client.connect();

        await createMigrationsTableIfNotExist(client);

        let migrationsBaseDir = path.resolve(
            process.cwd(),
            MIGRATIONS_DIR_NAME
        );

        let migrations = fs.readdirSync(migrationsBaseDir);

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
                    path.resolve(migrationsBaseDir, migration, "up.sql")
                )
                .toString();

            if (!alreadyApplyed) {
                await client.query(query);
                await client.query(
                    "INSERT INTO migrations_history (migration_name) VALUES ($1)",
                    [migration]
                );
                console.log(`migration ${migration} applyed.`);
            } else {
                console.log(`migration ${migration} already applyed.`);
            }
        }

        await client.end();

        console.log("All migrations applyed.");
    }
}
