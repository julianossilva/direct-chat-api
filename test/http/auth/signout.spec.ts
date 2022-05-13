import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { AppContext } from "../../../src/application/app-context";
import { SignoutService } from "../../../src/application/service/signout";
import {
    TransactionContext,
} from "../../../src/infra/transaction-context";
import { App } from "../../../src/main/app";

dotenv.config();

test("POST /signout | signout with success", async () => {
    let app = new App();

    function fakeFactory(
        appContext: AppContext,
        transactionContext: TransactionContext
    ) {
        let service: SignoutService = Object.create(SignoutService.prototype);
        service.handle = async (token: string): Promise<void> => {};
        return service;
    }
    app.appContext.serviceFactoryList.createSignoutService = fakeFactory;

    let res = await supertest(app.httpServer)
        .post("/signout")
        .set(`Authorization`, `Bearer abcd.qwert`)
        .send({})
        .expect(200);

    app.appContext.shutdown();
});
