import { Name } from "../../../domain/model/name";
import { PasswordHash } from "../../../domain/model/password-hash";
import { User } from "../../../domain/model/user";
import { UserID } from "../../../domain/model/user-id";
import { Username } from "../../../domain/model/username";
import { UserRepository } from "../../../domain/repository/user";
import { LazyTransactionalClientPG } from "../lazy-client-pg";

export class UserRepositoryPG implements UserRepository {
    constructor(private lazyClient: LazyTransactionalClientPG) {}

    async findByUsername(username: Username): Promise<User | null> {
        let res = await this.lazyClient.query(
            "SELECT id, username, password_hash, name FROM users WHERE username = $1",
            [username.username]
        );

        if (res.rows.length == 0) {
            return null;
        }

        return new User(
            new UserID(res.rows[0].id),
            new Username(res.rows[0].username),
            new PasswordHash(res.rows[0].password_hash),
            new Name(res.rows[0].name)
        );
    }

    async findByUserID(userID: UserID): Promise<User | null> {
        let res = await this.lazyClient.query(
            "SELECT id, username, password_hash, name FROM users WHERE id = $1",
            [userID.uuid]
        );

        if (res.rows.length == 0) {
            return null;
        }

        return new User(
            new UserID(res.rows[0].id),
            new Username(res.rows[0].username),
            new PasswordHash(res.rows[0].password_hash),
            new Name(res.rows[0].name)
        );
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
    }

    async delete(user: User): Promise<void> {
        await this.lazyClient.query("DELETE FROM users WHERE id = $1", [
            user.userID.uuid,
        ]);
    }
}
