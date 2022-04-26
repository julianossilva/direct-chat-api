
export class Name {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    equal(other: Name) {
        return this._name == other._name;
    }

    validate() {
        return true;
    } 
}