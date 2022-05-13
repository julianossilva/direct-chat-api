import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { AppContext } from "../../../src/application/app-context";
import { SignoutService } from "../../../src/application/service/signout";
import {
    NewUserDTO,
    SignupService,
} from "../../../src/application/service/signup";
import { TransactionContext } from "../../../src/infra/transaction-context";
import { App } from "../../../src/main/app";

dotenv.config();

test("POST /signup | signup with success", async () => {
    let app = new App();

    function fakeFactory(
        appContext: AppContext,
        transactionContext: TransactionContext
    ) {
        let service: SignupService = Object.create(SignupService.prototype);
        service.handle = async (token: NewUserDTO): Promise<void> => {};
        return service;
    }
    app.appContext.serviceFactoryList.createSignupService = fakeFactory;

    let res = await supertest(app.httpServer)
        .post("/signup")
        .send({
            username: "myusername",
            password: "mypassword",
            name: "myname",
        })
        .expect(201);

    app.appContext.shutdown();
});
