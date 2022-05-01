import express from "express";
import { AppContext } from "./app-context";
import { loadRoutes } from "./http/routes";

export class App {
    public httpServer: express.Express;
    public appContext: AppContext;

    constructor() {
        this.httpServer = express();
        this.appContext = new AppContext();
        loadRoutes(this.httpServer, this.appContext);
    }

    start() {
        this.startHTTPServer();
    }

    startHTTPServer() {
        const port = process.env.PORT;

        this.httpServer.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    }
}
