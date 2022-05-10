import { Pool } from "pg";
import { HashGenerator } from "../application/hash-generator";
import { UUIDGenerator } from "../application/uuid-generator";
import { TokenGenerator } from "../infra/token-generator";
import { TokenGeneratorHMACAndSHA256 } from "../infra/token-generator-hmac-sha256";
import { createHashGenerator } from "./services/create-hash-generator";
import { createUUIDGenerator } from "./services/create-uuid-generator";

export class AppContext {
    public pool: Pool;
    public tokenGenerator: TokenGenerator;
    public hashGenerator: HashGenerator;
    public uuidGenerator: UUIDGenerator;

    constructor() {
        this.pool = this.createPool();
        this.hashGenerator = this.createHashGenerator();
        this.uuidGenerator = this.createUUIDGenerator();
        this.tokenGenerator = this.createTokenGenerator();
    }

    createTokenGenerator(): TokenGenerator {
        return new TokenGeneratorHMACAndSHA256(process.env.AppSecret ?? "");
    }

    private createPool() {
        return new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
    }

    private createHashGenerator() {
        return createHashGenerator();
    }

    private createUUIDGenerator() {
        return createUUIDGenerator();
    }

    async shutdown() {
        await this.pool.end();
    }
}
