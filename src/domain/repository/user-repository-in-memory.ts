import _ from "lodash";
import { User } from "../model/user";
import { UserID } from "../model/user-id";
import { Username } from "../model/username";
import { UserRepository } from "./user";

export class UserRepositoryInMemory implements UserRepository {
    constructor(private users: User[] = []) {}

    async findByUsername(username: Username): Promise<User | null> {
        let user = this.users.find((e) => e.username.equal(username));
        if (!user) {
            return null;
        }
        return _.cloneDeep(user);
    }

    async findByUserID(userID: UserID): Promise<User | null> {
        let user = this.users.find((e) => e.userID.equal(userID));
        if (!user) {
            return null;
        }
        return _.cloneDeep(user);
    }
    async update(user: User): Promise<void> {
        let existentUser = await this.findByUserID(user.userID);
        if (existentUser) {
            await this.delete(user);
            await this.create(user);
        }
    }
    async create(user: User): Promise<void> {
        let existentUser = await this.findByUserID(user.userID);
        if (existentUser) {
            throw new Error("User id existent");
        }
        existentUser = await this.findByUsername(user.username);
        if (existentUser) {
            throw new Error("Username existent");
        }
        this.users.push(_.cloneDeep(user));
    }
    async delete(user: User): Promise<void> {
        let existentUser = await this.findByUserID(user.userID);
        if (!existentUser) {
            throw new Error("User id existent");
        }
        this.users.filter((e) => e.userID.equal(user.userID));
    }
}
