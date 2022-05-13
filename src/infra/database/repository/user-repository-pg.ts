import { Name } from "../../../domain/model/name";
import { PasswordHash } from "../../../domain/model/password-hash";
import { User } from "../../../domain/model/user";
import { UserID } from "../../../domain/model/user-id";
import { Username } from "../../../domain/model/username";
import { UserRepository } from "../../../domain/repository/user";
import { LazyTransactionalClientPG } from "../lazy-client-pg";

export class UserRepositoryPG implements UserRepository {
    private cached: User[] = [];
    constructor(private lazyClient: LazyTransactionalClientPG) {}

    async findByUsername(username: Username): Promise<User | null> {
        let res = await this.lazyClient.query(
            "SELECT id, username, password_hash, name FROM users WHERE username = $1",
            [username.username]
        );

        if (res.rows.length == 0) {
            return null;
        }

        let user = new User(
            new UserID(res.rows[0].id),
            new Username(res.rows[0].username),
            new PasswordHash(res.rows[0].password_hash),
            new Name(res.rows[0].name)
        );

        let i = this.cached.findIndex((e) => e.equal(user));
        if (i >= 0) {
            this.cached[i].username = user.username;
            this.cached[i].passwordHash = user.passwordHash;
            this.cached[i].name = user.name;
            return this.cached[i];
        } else {
            this.cached.push(user);
            return user;
        }
    }

    async findByUserID(userID: UserID): Promise<User | null> {
        let res = await this.lazyClient.query(
            "SELECT id, username, password_hash, name FROM users WHERE id = $1",
            [userID.uuid]
        );

        if (res.rows.length == 0) {
            return null;
        }

        let user = new User(
            new UserID(res.rows[0].id),
            new Username(res.rows[0].username),
            new PasswordHash(res.rows[0].password_hash),
            new Name(res.rows[0].name)
        );

        let i = this.cached.findIndex((e) => e.equal(user));
        if (i >= 0) {
            this.cached[i].username = user.username;
            this.cached[i].passwordHash = user.passwordHash;
            this.cached[i].name = user.name;
            return this.cached[i];
        } else {
            this.cached.push(user);
            return user;
        }
    }

    async update(user: User): Promise<void> {
        await this.lazyClient.query(
            "UPDATE users SET username=$2, password_hash=$3, name=$4 WHERE id=$1",
            [
                user.userID.uuid,
                user.username.username,
                user.passwordHash.passwordHash,
                user.name.name,
            ]
        );

        let existent = await this.findByUserID(user.userID);
        if (existent) {
            existent.username = user.username;
            existent.name = user.name;
            existent.passwordHash = user.passwordHash;
        }
    }

    async create(user: User): Promise<void> {
        await this.lazyClient.query(
            "INSERT INTO users (id, username, password_hash, name) VALUES ($1, $2, $3, $4)",
            [
                user.userID.uuid,
                user.username.username,
                user.passwordHash.passwordHash,
                user.name.name,
            ]
        );
        this.cached.push(user);
    }

    async delete(user: User): Promise<void> {
        await this.lazyClient.query("DELETE FROM users WHERE id = $1", [
            user.userID.uuid,
        ]);
        this.cached = this.cached.filter(
            (e) => e.userID.uuid != user.userID.uuid
        );
    }
}
