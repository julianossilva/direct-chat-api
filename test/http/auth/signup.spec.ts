import dotenv from "dotenv";
import supertest from "supertest";
import { App } from "../../../src/main/app";

dotenv.config();

test("POST /signup", async () => {
    dotenv.config();

    let app = new App();

    await app.appContext.pool.query("TRUNCATE TABLE users");

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
