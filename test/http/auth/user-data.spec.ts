import dotenv from "dotenv";
import supertest from "supertest";
import { AppContext } from "../../../src/application/app-context";
import {
    UserDataDTO,
    UserDataService,
} from "../../../src/application/service/get-current-user-data";
import {
    TransactionContext,
} from "../../../src/infra/transaction-context";
import { App } from "../../../src/main/app";

dotenv.config();

test("GET /user-data | signout with success", async () => {
    let app = new App();

    function fakeFactory(
        appContext: AppContext,
        transactionContext: TransactionContext
    ) {
        let service: UserDataService = Object.create(UserDataService.prototype);
        service.handle = async (token: string): Promise<UserDataDTO> => {
            return {
                username: "myusername",
                name: "My Name",
            };
        };
        return service;
    }

    app.appContext.serviceFactoryList.createUserDataService = fakeFactory;

    let res = await supertest(app.httpServer)
        .get("/user-data")
        .set(`Authorization`, `Bearer abcd.qwert`)
        .send({})
        .expect(200);
    app.appContext.shutdown();

    expect(res.body.username).toBe("myusername");
    expect(res.body.name).toBe("My Name");
});
