import bcrypt from "bcryptjs";

import { HashGenerator } from "../application/hash-generator";

export class HashGeneratorBcrypt implements HashGenerator {
    async generate(password: string): Promise<string> {
        return await bcrypt.hash(password, 13);
    }
    async verify(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
