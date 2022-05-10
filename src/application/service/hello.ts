export class HelloService {
    constructor() {}

    async handle(name: string) {
        return `Hello ${name}`;
    }
}
