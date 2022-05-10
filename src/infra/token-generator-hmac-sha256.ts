import crypto from "crypto";
import { TokenGenerator } from "./token-generator";

export class TokenGeneratorHMACAndSHA256 implements TokenGenerator {
    constructor(private secret: string) {}

    generate(id: string): string {
        let hmac = crypto.createHmac("sha256", this.secret);
        hmac.update(id);
        let tag = hmac.digest().toString("base64");
        return `${id}.${tag}`;
    }

    parse(token: string): string {
        let [id, tag] = token.split(".");

        if (tag == undefined) {
            throw new Error("token format error");
        }

        let hmac = crypto.createHmac("sha256", this.secret);
        hmac.update(id);
        let createdTag = hmac.digest().toString("base64");

        if (tag != createdTag) {
            throw new Error("invalid token tag");
        }

        return id;
    }
}
