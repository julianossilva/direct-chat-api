import dotenv from "dotenv";
import { Pool } from "pg";
import { Name } from "../../../domain/model/name";
import { PasswordHash } from "../../../domain/model/password-hash";
import { User } from "../../../domain/model/user";
import { UserID } from "../../../domain/model/user-id";
import { Username } from "../../../domain/model/username";
import { LazyTransactionalClientPG } from "../lazy-client-pg";
import { UserRepositoryPG } from "./user-repository-pg";

dotenv.config();

let pool: Pool;

beforeEach(async () => {
    pool = new Pool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
    await pool.query("TRUNCATE TABLE users");
});

afterEach(async () => {
    pool.end();
});

test("Can create, retrieve, and delete", async () => {
    /**
     * Creates a users
     */
    let lazyClient = new LazyTransactionalClientPG(pool);
    let userRepositoryPG = new UserRepositoryPG(lazyClient);

    let userID = new UserID("68f72c3d-afa4-457d-a704-4944594b9d5c");
    let username = new Username("ausername");
    let passwordHash = new PasswordHash("shhhh");
    let name = new Name("A name");

    let user = new User(userID, username, passwordHash, name);

    await userRepositoryPG.create(user);
    await lazyClient.close();

    /**
     * Retrieve user
     */
    lazyClient = new LazyTransactionalClientPG(pool);
    userRepositoryPG = new UserRepositoryPG(lazyClient);

    let findedUser = await userRepositoryPG.findByUserID(userID);
    if (findedUser == null) {
        throw new Error("user not finded.");
    }
    expect(user.equal(findedUser)).toBe(true);
    await lazyClient.close();
});

test("Can create and update an user", async () => {
    /**
     * Creates a users
     */
    let lazyClient = new LazyTransactionalClientPG(pool);
    let userRepositoryPG = new UserRepositoryPG(lazyClient);

    let userID = new UserID("68f72c3d-afa4-457d-a704-4944594b9d5c");
    let username = new Username("ausername");
    let passwordHash = new PasswordHash("shhhh");
    let name = new Name("A name");

    let user = new User(userID, username, passwordHash, name);

    await userRepositoryPG.create(user);
    await lazyClient.close();

    /**
     * Retrieve user
     */
    lazyClient = new LazyTransactionalClientPG(pool);
    userRepositoryPG = new UserRepositoryPG(lazyClient);

    let findedUser = await userRepositoryPG.findByUserID(userID);
    if (findedUser == null) {
        throw new Error("user not finded.");
    }

    let newUsername = new Username("newUsername");
    let newPasswordHash = new PasswordHash("xxxxxx");
    let newName = new Name("A New Name");

    findedUser.username = newUsername;
    findedUser.passwordHash = newPasswordHash;
    findedUser.name = newName;

    await userRepositoryPG.update(findedUser);

    await lazyClient.close();

    /**
     * Verify update
     */
    lazyClient = new LazyTransactionalClientPG(pool);
    userRepositoryPG = new UserRepositoryPG(lazyClient);

    let updatedUser = await userRepositoryPG.findByUserID(userID);
    if (updatedUser == null) {
        throw new Error("user not finded.");
    }

    expect(findedUser.equal(updatedUser)).toBe(true);
    await lazyClient.close();
});
