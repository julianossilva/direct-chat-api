import { v4 } from 'uuid';

export interface UUIDGenerator {
    generate(): string;
}