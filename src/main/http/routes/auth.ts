import joi from "joi";
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
            let schema = joi.object({
                username: joi.string().min(4),
                password: joi.string().min(8),
                name: joi.string(),
            });

            const value = await schema.validate(req.body);
            if (value.error) {
                res.status(400).send({errors: value.error})
            }

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
