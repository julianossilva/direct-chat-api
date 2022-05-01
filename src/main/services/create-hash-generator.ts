import { HashGeneratorBcrypt } from "../../infra/hash-generator-bcript";

export function createHashGenerator() {
    return new HashGeneratorBcrypt();
}
