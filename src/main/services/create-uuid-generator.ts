import { UUIDGeneratorDefault } from "../../infra/uuid-generator";

export function createUUIDGenerator() {
    return new UUIDGeneratorDefault();
}
