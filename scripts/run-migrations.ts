import { RunMigrations } from "../src/infra/database/migrations/run-migrations";
import dotenv from "dotenv";

dotenv.config();

new RunMigrations().run();
