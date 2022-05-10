export interface TokenGenerator {
    generate(id: string): string;
    parse(token: string): string;
}
