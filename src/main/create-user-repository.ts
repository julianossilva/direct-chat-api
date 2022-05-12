import { UserRepositoryPG } from "../infra/database/repository/user-repository-pg";
import { TransactionContext } from "../infra/transaction-context";
import { AppContext } from "../application/app-context";

export function createUserRepository(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    return new UserRepositoryPG(transactionContext.lazyTrasactionalClient);
}
