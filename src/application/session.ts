import { UserID } from "../domain/model/user-id";
import { UserRepository } from "../domain/repository/user";
import { TokenGenerator } from "../infra/token-generator";

export class Session {
    constructor(
        public id: string,
        public userId: UserID,
        public expiration: Date
    ) {}
}
