import { HelloService } from "../../application/service/hello";
import { TransactionContext } from "../../infra/transaction-context";
import { AppContext } from "../app-context";

export function createHelloService(
    _appContext: AppContext,
    _transactionService: TransactionContext
) {
    return new HelloService();
}
