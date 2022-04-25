import bcrypt from 'bcryptjs';

export class HashGeneratorBcrypt {
    async generate(password: string): Promise<string> {
        return await bcrypt.hash(password, 11);
    }

    async verify(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}