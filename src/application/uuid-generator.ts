import { v4 } from 'uuid';

export class UUIDGenerator {
    generate() {
        return v4();
    }
}