import { Pool } from "pg";
import { HashGenerator } from "./hash-generator";
import { UUIDGenerator } from "./uuid-generator";
import { TokenGenerator } from "../infra/token-generator";
import { TokenGeneratorHMACAndSHA256 } from "../infra/token-generator-hmac-sha256";
import { createHashGenerator } from "../main/services/create-hash-generator";
import { createUUIDGenerator } from "../main/services/create-uuid-generator";
import { TransactionContext } from "../infra/transaction-context";
import { SignupService } from "./service/signup";
import { SigninService } from "./service/signin";
import { SignoutService } from "./service/signout";
import { UserDataService } from "./service/get-current-user-data";

export type ServiceFactory<T> = (
    appContext: AppContext,
    transactionContext: TransactionContext
) => T;

export type ServiceFactoryList = {
    createUserDataService: ServiceFactory<UserDataService>;
    createSignupService: ServiceFactory<SignupService>;
    createSigninService: ServiceFactory<SigninService>;
    createSignoutService: ServiceFactory<SignoutService>;
};

export class AppContext {
    public pool: Pool;
    public tokenGenerator: TokenGenerator;
    public hashGenerator: HashGenerator;
    public uuidGenerator: UUIDGenerator;
    public serviceFactoryList: ServiceFactoryList;

    constructor(serviceFactoryList: ServiceFactoryList) {
        this.serviceFactoryList = serviceFactoryList;
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
