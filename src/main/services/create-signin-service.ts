import { SigninService } from "../../application/service/signin";
import { TransactionContext } from "../../infra/transaction-context";
import { AppContext } from "../app-context";

export function createSigninService(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    return new SigninService(
        appContext.hashGenerator,
        transactionContext.userRepository,
        transactionContext.sessionManager
    );
}
