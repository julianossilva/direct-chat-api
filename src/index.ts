
import express from "express";
import { loadRoutes } from "./main/routes";

let app = express();
let port = 8000;

app.use(loadRoutes());

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});