import express from "express";
import { AppContext } from "../../app-context";
import { createAuthService } from "../../services/create-auth-service";
import { createTransactionContext } from "../../../infra/transaction-context";

export const registerAuthRoutes = (
    express: express.Express,
    appContext: AppContext
) => {

    /**
     * Signup
     */
    express.get("/signup", async (req, res) => {
        try {
            let transactionContext = createTransactionContext(appContext);

            await createAuthService(appContext, transactionContext).signup({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
            });

            await transactionContext.closeTransaction();
            res.status(200).send();
        } catch (error) {
            res.status(500).send();
        }
    });
};
