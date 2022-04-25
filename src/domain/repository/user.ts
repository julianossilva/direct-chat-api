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
