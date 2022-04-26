export class Username {
    private _username: string;

    constructor(username: string) {
        this._username = username;
    }

    get username() {
        return this._username;
    }

    equal(other: Username) {
        return this._username == other._username;
    }
}
