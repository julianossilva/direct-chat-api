import path from "path";
import fs from "fs";

const MIGRATIONS_DIR_NAME = "migrations";

export class GenerateMigration {
    async run() {
        if (process.argv.length < 3) {
            console.error("Insert migration's name.");
            return;
        }

        let migrationsBaseDir = path.resolve(
            process.cwd(),
            MIGRATIONS_DIR_NAME
        );

        let now = new Date();
        let year = `${now.getUTCFullYear()}`.padStart(4, "0")
        let month = `${now.getUTCMonth()}`.padStart(2, "0")
        let day = `${now.getUTCDate()}`.padStart(2, "0")
        let hour = `${now.getUTCHours()}`.padStart(2, "0")
        let minute = `${now.getUTCMinutes()}`.padStart(2, "0")
        let sec = `${now.getUTCSeconds()}`.padStart(2, "0")
        let milli = `${now.getUTCMilliseconds()}`.padStart(3, "0")
        let timestamp = `${year}-${month}-${day}_${hour}-${minute}-${sec}.${milli}`;

        let migrationsDir = path.resolve(
            migrationsBaseDir,
            `${timestamp}_${process.argv[2]}`
        );

        fs.mkdirSync(migrationsDir, {
            recursive: true,
        });

        fs.writeFileSync(path.resolve(migrationsDir, "up.sql"), "-- up.sql");

        fs.writeFileSync(
            path.resolve(migrationsDir, "down.sql"),
            "-- down.sql"
        );
    }
}
