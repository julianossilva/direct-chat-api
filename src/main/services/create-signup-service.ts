import { SignupService } from "../../application/service/signup";
import { TransactionContext } from "../../infra/transaction-context";
import { AppContext } from "../../application/app-context";

export function createSignupService(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    return new SignupService(
        appContext.hashGenerator,
        appContext.uuidGenerator,
        transactionContext.userRepository
    );
}
