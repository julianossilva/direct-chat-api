import { AuthService } from "../../application/service/auth";
import { AppContext } from "../app-context";
import { TransactionContext } from "../../infra/transaction-context";

export function createAuthService(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    let authService = new AuthService(
        appContext.hashGenerator,
        appContext.uuidGenerator,
        transactionContext.userRepository
    );

    return authService;
}
