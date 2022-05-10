import { SignoutService } from "../../application/service/signout";
import { TransactionContext } from "../../infra/transaction-context";
import { AppContext } from "../app-context";

export function createSignoutService(
    appContext: AppContext,
    transactionContext: TransactionContext
) {
    return new SignoutService(transactionContext.sessionManager);
}
