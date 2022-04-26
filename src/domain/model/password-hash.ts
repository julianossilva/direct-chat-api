export class PasswordHash {
    private _passwordHash: string;

    constructor(passwordHash: string) {
        this._passwordHash = passwordHash;
    }

    get passwordHash() {
        return this._passwordHash;
    }

    equal(other: PasswordHash) {
        return this._passwordHash == other._passwordHash;
    }
}
