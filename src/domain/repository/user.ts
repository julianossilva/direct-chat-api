import { User } from "../model/user";
import { UserID } from "../model/user-id";

export interface UserRepository {
    findByUserID(userID: UserID): Promise<User | null>;
    update(user: User): Promise<void>;
    create(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}
