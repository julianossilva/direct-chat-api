import { AppContext } from "../../application/app-context";
import { UserDataService } from "../../application/service/get-current-user-data";
import { TransactionContext } from "../../infra/transaction-context";

export function createUserDataService(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    return new UserDataService(
        transactionContext.userRepository,
        transactionContext.sessionManager
    );
}
