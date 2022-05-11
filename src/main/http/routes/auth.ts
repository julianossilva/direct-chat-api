import joi from "joi";
import express from "express";
import { AppContext } from "../../app-context";
import { createTransactionContext } from "../../../infra/transaction-context";
import { SessionManager } from "../../../application/session-manager";
import { createSignupService } from "../../services/create-signup-service";
import { createSigninService } from "../../services/create-signin-service";
import { createSignoutService } from "../../services/create-signout-service";

export const registerAuthRoutes = (
    express: express.Express,
    appContext: AppContext
) => {
    /**
     * Signup
     */
    express.post("/signup", async (req, res) => {
        try {
            let schema = joi.object({
                username: joi.string().min(4),
                password: joi.string().min(8),
                name: joi.string(),
            });

            const value = schema.validate(req.body);
            if (value.error) {
                res.status(400).send({ error: "Input error" });
            }

            let transactionContext = createTransactionContext(appContext);

            await createSignupService(appContext, transactionContext).handle({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
            });

            await transactionContext.closeTransaction();
            res.status(201).send();
        } catch (error) {
            res.status(500).send();
        }
    });

    /**
     * Signin
     */
    express.post("/signin", async (req, res) => {
        try {
            let transactionContext = createTransactionContext(appContext);
            let token = await createSigninService(
                appContext,
                transactionContext
            ).handle({
                username: req.body.username,
                password: req.body.password,
            });

            await transactionContext.closeTransaction();
            res.status(200).send({
                token,
            });
        } catch (error) {
            res.status(500).send();
        }
    });

    /**
     * Signout
     */
    express.post("/signout", async (req, res) => {
        try {
            let authHeader = req.header("Authorization");
            if (authHeader && authHeader.length > 0) {
                let token = authHeader[0].replace("Bearer ", "");
                let transactionContext = createTransactionContext(appContext);
                await createSignoutService(
                    appContext,
                    transactionContext
                ).handle(token);
                await transactionContext.closeTransaction();
                res.status(201).send();
            } else {
                res.status(400).send({ error: "Input error" });
            }
        } catch (error) {
            res.status(500).send();
        }
    });
};
