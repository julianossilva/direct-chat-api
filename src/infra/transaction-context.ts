import { UserRepository } from "../domain/repository/user";
import { LazyTransactionalClientPG } from "./database/lazy-client-pg";
import { UserRepositoryPG } from "./database/repository/user-repository-pg";
import { AppContext } from "../application/app-context";
import { SessionManager } from "../application/session-manager";
import { SessionManagerDefault } from "./session-manager-default";
import { SessionStore } from "../application/session-store";
import { SessionStorePG } from "./session-store-pg";

export class TransactionContext {
    lazyTrasactionalClient: LazyTransactionalClientPG;
    sessionStore: SessionStore;
    sessionManager: SessionManager;
    userRepository: UserRepository;

    constructor(private appContext: AppContext) {
        this.lazyTrasactionalClient = new LazyTransactionalClientPG(
            appContext.pool
        );
        this.userRepository = new UserRepositoryPG(this.lazyTrasactionalClient);
        this.sessionStore = new SessionStorePG(this.lazyTrasactionalClient);
        this.sessionManager = new SessionManagerDefault(
            appContext.tokenGenerator,
            this.sessionStore,
            appContext.uuidGenerator,
            this.userRepository
        );
    }

    async closeTransaction() {
        await this.lazyTrasactionalClient.close();
    }
}

export function createTransactionContext(appContext: AppContext) {
    return new TransactionContext(appContext);
}
