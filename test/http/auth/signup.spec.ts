import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { CleanDatabase } from "../../../src/infra/database/command/clean-database";
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
    await pool.end()
});

test("POST /signup", async () => {
    dotenv.config();

    let app = new App();

    await supertest(app.httpServer)
        .post("/signup")
        .send({
            username: "juliano",
            password: "12345678",
            name: "Juliano",
        })
        .expect(201);

    await app.appContext.shutdown();
});
