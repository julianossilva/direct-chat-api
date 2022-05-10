import express from "express";
import { createTransactionContext } from "../../infra/transaction-context";
import { AppContext } from "../app-context";
import { createHelloService } from "../services/create-hello-service";
import { registerAuthRoutes } from "./routes/auth";

export function loadRoutes(express: express.Express, appContext: AppContext) {
    express.get("/hello/:name", async (req, res) => {
        try {
            let transactionContext = createTransactionContext(appContext);
            let helloService = createHelloService(
                appContext,
                transactionContext
            );

            let message = await helloService.handle(req.params.name);

            transactionContext.closeTransaction();

            res.status(200).send(message);
        } catch (error) {
            res.status(500).send();
        }
    });

    registerAuthRoutes(express, appContext);
}
