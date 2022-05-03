import dotenv from "dotenv";
import supertest from "supertest";
import { CleanDatabase } from "../../../src/infra/database/command/clean-database";
import { App } from "../../../src/main/app";

dotenv.config();

test("POST /signup", async () => {
    dotenv.config();

    let app = new App();

    await new CleanDatabase(app.appContext.pool).run()
    await supertest(app.httpServer)
        .post("/signup")
        .send({
            username: "juliano",
            password: "12345678",
            name: "Juliano",
        })
        .expect(201)
        
    await app.appContext.shutdown();
});
