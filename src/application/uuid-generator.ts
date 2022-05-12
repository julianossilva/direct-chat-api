export interface UUIDGenerator {
    generate(): string;
}

export class UUIDGeneratorUnimplementedMock implements UUIDGenerator {
    generate(): string {
        throw new Error("Method not implemented.");
    }
}
