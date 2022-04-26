export class UserID {
    private _uuid: string;

    constructor(uuid: string) {
        this._uuid = uuid;
    }

    get uuid() {
        return this._uuid;
    }

    equal(other: UserID) {
        return this._uuid == other._uuid;
    }
}
