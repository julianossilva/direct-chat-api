
import express from "express";
import dotenv from "dotenv";

import { loadRoutes } from "./main/routes";

dotenv.config();

const port = process.env.PORT;

let app = express();

app.use(loadRoutes());

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});