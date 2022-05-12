import { InterfaceExtends } from "@babel/types";
import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { AppContext } from "../../../src/application/app-context";
import { SignoutService } from "../../../src/application/service/signout";
import { Name } from "../../../src/domain/model/name";
import { PasswordHash } from "../../../src/domain/model/password-hash";
import { User } from "../../../src/domain/model/user";
import { UserID } from "../../../src/domain/model/user-id";
import { Username } from "../../../src/domain/model/username";
import { CleanDatabase } from "../../../src/infra/database/command/clean-database";
import {
    createTransactionContext,
    TransactionContext,
} from "../../../src/infra/transaction-context";
import { App } from "../../../src/main/app";

dotenv.config();

beforeEach(async () => {
    let pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
    await new CleanDatabase(pool).run();
    await pool.end();
});

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
