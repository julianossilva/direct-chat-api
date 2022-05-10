import { TokenGeneratorHMACAndSHA256 } from "./token-generator-hmac-sha256";
import { UUIDGeneratorDefault } from "./uuid-generator";

test("TokenGeneratorHMAC", async () => {
    let tokenGenerator = new TokenGeneratorHMACAndSHA256("shhhhh");
    let uuid = new UUIDGeneratorDefault().generate();

    let token = tokenGenerator.generate(uuid);
    expect(tokenGenerator.parse(token)).toBe(uuid);
});

test("Throw with invalid token", async () => {
    let tokenGenerator = new TokenGeneratorHMACAndSHA256("shhhhh");
    let otherTokenGenerator = new TokenGeneratorHMACAndSHA256("****");

    let uuid = new UUIDGeneratorDefault().generate();

    let token = tokenGenerator.generate(uuid);
    expect(() => {
        otherTokenGenerator.parse(token);
    }).toThrow();
});
