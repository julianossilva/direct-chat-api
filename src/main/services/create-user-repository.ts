import { Pool } from "pg";
import { LazyTransactionalClientPG } from "../../infra/database/lazy-client-pg";
import { UserRepositoryPG } from "../../infra/database/repository/user-repository-pg";
import { App } from "../app";

export function createUserRepository(lazyClient: LazyTransactionalClientPG) {
    return new UserRepositoryPG(lazyClient);
}
