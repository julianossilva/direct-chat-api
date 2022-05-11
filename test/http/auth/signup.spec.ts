import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { Username } from "../../../src/domain/model/username";
import { CleanDatabase } from "../../../src/infra/database/command/clean-database";
import { createTransactionContext } from "../../../src/infra/transaction-context";
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

test("POST /signup | create user with success", async () => {
    let app = new App();

    await supertest(app.httpServer)
        .post("/signup")
        .send({
            username: "juliano",
            password: "12345678",
            name: "Juliano",
        })
        .expect(201);

    let transactionContext = createTransactionContext(app.appContext);

    let user = await transactionContext.userRepository.findByUsername(new Username("juliano"));
    
    expect(user).not.toBeNull()

    await transactionContext.closeTransaction();

    await app.appContext.shutdown();
});
