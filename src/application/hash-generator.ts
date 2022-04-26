export interface HashGenerator {
    generate(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}
