export interface HashGenerator {
    generate(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}

export class HashGeneratorUnimplementedMock implements HashGenerator {
    generate(password: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    verify(password: string, hash: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
