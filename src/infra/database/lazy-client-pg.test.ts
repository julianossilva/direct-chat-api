import { Pool } from "pg";
import dotenv from "dotenv";
import { LazyTransactionalClientPG } from "./lazy-client-pg";

dotenv.config();

test("LazyTransactionalClientPG", async () => {
    let pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

    let sut = new LazyTransactionalClientPG(pool);
    let res = await sut.query("SELECT 'Hello World!' as hello");
    expect(res.rows[0].hello).toBe("Hello World!");
    await sut.close();

    await pool.end();
}, 30000);

