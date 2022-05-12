import express from "express";
import { AppContext } from "../application/app-context";
import { loadRoutes } from "./http/routes";
import serviceList from "./service-factory-list";

export class App {
    public httpServer: express.Express;
    public appContext: AppContext;

    constructor() {
        this.httpServer = express();
        this.httpServer.use(express.json());
        this.appContext = new AppContext(serviceList);
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
