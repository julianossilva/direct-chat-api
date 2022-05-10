import { SessionStore } from "../application/session-store";
import { SessionStoreInMemory } from "../application/session-store.mocks";
import { UUIDGenerator } from "../application/uuid-generator";
import { Name } from "../domain/model/name";
import { PasswordHash } from "../domain/model/password-hash";
import { User } from "../domain/model/user";
import { UserID } from "../domain/model/user-id";
import { Username } from "../domain/model/username";
import { UserRepository } from "../domain/repository/user";
import { UserRepositoryInMemory } from "../domain/repository/user-repository-in-memory";
import { SessionManagerDefault } from "./session-manager-default";
import { TokenGenerator } from "./token-generator";
import { TokenGeneratorHMACAndSHA256 } from "./token-generator-hmac-sha256";
import { UUIDGeneratorDefault } from "./uuid-generator";

let tokenGenerator: TokenGenerator;
let sessionStore: SessionStore;
let uuidGenerator: UUIDGenerator;
let userRepository: UserRepository;
let sut: SessionManagerDefault;

beforeEach(async () => {
    tokenGenerator = new TokenGeneratorHMACAndSHA256("shhhh");
    sessionStore = new (class extends SessionStoreInMemory {})();
    uuidGenerator = new UUIDGeneratorDefault();
    userRepository = new UserRepositoryInMemory();

    sut = new SessionManagerDefault(
        tokenGenerator,
        sessionStore,
        uuidGenerator,
        userRepository
    );
});

test("create session and retrieve", async () => {
    let user = new User(
        new UserID("69a60bcd-1137-499a-a4b0-52fa754db3b7"),
        new Username("whoiam"),
        new PasswordHash("shhhh"),
        new Name("Anon.")
    );
    await userRepository.create(user);
    let { token, session } = await sut.start(user);
    let retrievedSession = await sut.get(token);

    expect(session.id).toBe(retrievedSession?.id);
});
