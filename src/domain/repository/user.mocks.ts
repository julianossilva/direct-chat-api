import { User } from "../model/user";
import { UserID } from "../model/user-id";
import { Username } from "../model/username";
import { UserRepository } from "./user";

export class UserRepositoryMock implements UserRepository {
    findByUsername(username: Username): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    findByUserID(userID: UserID): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    update(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
