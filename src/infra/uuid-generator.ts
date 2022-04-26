import { v4 } from 'uuid';

import { UUIDGenerator } from "../application/uuid-generator";


export class UUIDGeneratorDefault implements UUIDGenerator {
    generate(): string {
        return v4()
    }
}