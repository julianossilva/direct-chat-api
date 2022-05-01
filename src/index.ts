import dotenv from "dotenv";
import { App } from "./main/app";

dotenv.config();

let app = new App();

app.start();
