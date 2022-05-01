import express from "express";
import { AppContext } from "./app-context";
import { loadRoutes } from "./http/routes";

export class App {
    public httpServer: express.Express = express();
    public appContext = new AppContext();

    constructor() {}

    start() {
        this.startHTTPServer();
    }

    startHTTPServer() {
        const port = process.env.PORT;
        loadRoutes(this.httpServer, this.appContext);
        this.httpServer.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    }
}
