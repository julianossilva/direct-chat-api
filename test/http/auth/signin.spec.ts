import dotenv from "dotenv";
import supertest from "supertest";
import { AppContext } from "../../../src/application/app-context";
import {
    LoginDTO,
    SigninService,
} from "../../../src/application/service/signin";
import { TransactionContext } from "../../../src/infra/transaction-context";
import { App } from "../../../src/main/app";

dotenv.config();

test("POST /signin | login with success", async () => {
    let app = new App();

    function fakeFactory(
        appContext: AppContext,
        transactionContext: TransactionContext
    ) {
        let service: SigninService = Object.create(SigninService.prototype);
        service.handle = async (data: LoginDTO): Promise<string> => {
            return "mytoken.tag";
        };
        return service;
    }

    app.appContext.serviceFactoryList.createSigninService = fakeFactory;

    let res = await supertest(app.httpServer)
        .post("/signin")
        .send({
            username: "myusername",
            password: "mypassword",
        })
        .expect(200);
    app.appContext.shutdown();

    expect(res.body.token).toBe("mytoken.tag");
});
