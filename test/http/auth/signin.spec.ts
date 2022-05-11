import dotenv from "dotenv";
import { Pool } from "pg";
import supertest from "supertest";
import { Name } from "../../../src/domain/model/name";
import { PasswordHash } from "../../../src/domain/model/password-hash";
import { User } from "../../../src/domain/model/user";
import { UserID } from "../../../src/domain/model/user-id";
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

test("POST /signin | login with success", async () => {
    let app = new App();

    let transactionContext = createTransactionContext(app.appContext);
    await transactionContext.userRepository.create(
        new User(
            new UserID("19ebab10-24bd-4eec-8a8f-60fee8c30b49"),
            new Username("juliano"),
            new PasswordHash(
                await app.appContext.hashGenerator.generate("12345678")
            ),
            new Name("Juliano")
        )
    );
    await transactionContext.closeTransaction();

    let res = await supertest(app.httpServer)
        .post("/signin")
        .send({
            username: "juliano",
            password: "12345678",
        })
        .expect(200);

    expect(res.body).toHaveProperty("token");

    transactionContext = createTransactionContext(app.appContext);
    let user = await transactionContext.sessionManager.get(
        String(res.body.token)
    );
    expect(user).not.toBeNull();
    await transactionContext.closeTransaction();

    await app.appContext.shutdown();
});
