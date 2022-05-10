import dotenv from "dotenv";
import { after } from "lodash";
import { Pool } from "pg";
import { Session } from "../application/session";
import { SessionStore } from "../application/session-store";
import { UUIDGenerator } from "../application/uuid-generator";
import { UserID } from "../domain/model/user-id";
import { LazyTransactionalClientPG } from "./database/lazy-client-pg";
import { SessionStorePG } from "./session-store-pg";
import { UUIDGeneratorDefault } from "./uuid-generator";

dotenv.config();

let pool: Pool;
let uuidGenerator: UUIDGenerator;

beforeEach(async () => {
    uuidGenerator = new UUIDGeneratorDefault();
    pool = new Pool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
});

afterEach(async () => {
    await pool.end();
});

test("Create and read a session and delete", async () => {
    let sessionID = uuidGenerator.generate();
    let userID = new UserID(uuidGenerator.generate());
    let expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

    let lazyClient = new LazyTransactionalClientPG(pool);
    let sut = new SessionStorePG(lazyClient);
    await sut.create(new Session(sessionID, userID, expiration));
    await lazyClient.close();

    lazyClient = new LazyTransactionalClientPG(pool);
    sut = new SessionStorePG(lazyClient);
    let retrievedSession = await sut.find(sessionID);
    await lazyClient.close();

    expect(retrievedSession?.id).toBe(sessionID);
    expect(retrievedSession?.userId.equal(userID)).toBe(true);
    expect(retrievedSession?.expiration.toISOString()).toBe(
        expiration.toISOString()
    );

    lazyClient = new LazyTransactionalClientPG(pool);
    sut = new SessionStorePG(lazyClient);
    retrievedSession = await sut.find(sessionID);
    if (!retrievedSession) throw new Error("Session not founded");
    await sut.delete(retrievedSession);
    await lazyClient.close();

    lazyClient = new LazyTransactionalClientPG(pool);
    sut = new SessionStorePG(lazyClient);
    retrievedSession = await sut.find(sessionID);
    expect(retrievedSession).toBe(null);
    await lazyClient.close();
});
