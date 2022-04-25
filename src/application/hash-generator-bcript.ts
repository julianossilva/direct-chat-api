
export interface HashGeneratorBcrypt {
    generate(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}