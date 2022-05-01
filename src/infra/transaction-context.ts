import { UserRepository } from "../domain/repository/user";
import { LazyTransactionalClientPG } from "./database/lazy-client-pg";
import { UserRepositoryPG } from "./database/repository/user-repository-pg";
import { AppContext } from "../main/app-context";

export class TransactionContext {
    lazyTrasactionalClient: LazyTransactionalClientPG;
    userRepository: UserRepository;

    constructor(private appContext: AppContext) {
        this.lazyTrasactionalClient = new LazyTransactionalClientPG(
            appContext.pool
        );

        this.userRepository = new UserRepositoryPG(this.lazyTrasactionalClient);
    }

    async closeTransaction() {
        await this.lazyTrasactionalClient.close()
    }
}

export function createTransactionContext(appContext: AppContext) {
    return new TransactionContext(appContext);
}
