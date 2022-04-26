import { Name } from "./name";
import { PasswordHash } from "./password-hash";
import { UserID } from "./user-id";
import { Username } from "./username";


export class User {

    private _uuid: UserID;
    private _username: Username;
    private _passwordHash: PasswordHash;
    private _name: Name;

    constructor(uuid: UserID, username: Username, passwordHash: PasswordHash, name: Name) {
        this._uuid = uuid;
        this._username = username;
        this._passwordHash = passwordHash;
        this._name = name;
    }

    get userID() {
        return this._uuid;
    }

    set userID(value: UserID) {
        this._uuid = value;
    }

    get username() {
        return this._username;
    }

    set username(value: Username) {
        this._username = value;
    }

    get passwordHash() {
        return this._passwordHash;
    }

    set passwordHash(value: PasswordHash) {
        this._passwordHash = value;
    }

    get name() {
        return this._name;
    }

    set name(value: Name) {
        this._name = value;
    }
}
