import dotenv from "dotenv";
import { RollbackMigrations } from "../src/infra/database/migrations/command/rollback-migrations";

dotenv.config();

new RollbackMigrations().run();
