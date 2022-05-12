import { User } from "../model/user";
import { UserID } from "../model/user-id";
import { Username } from "../model/username";

export interface UserRepository {
    findByUsername(username: Username): Promise<User | null>;
    findByUserID(userID: UserID): Promise<User | null>;
    update(user: User): Promise<void>;
    create(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}

export class UserRepositoryUnimplementedMock implements UserRepository {
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
