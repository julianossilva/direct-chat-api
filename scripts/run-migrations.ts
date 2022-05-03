import dotenv from "dotenv";
import { RunMigrations } from "../src/infra/database/migrations/command/run-migrations";

dotenv.config();

new RunMigrations().run();
