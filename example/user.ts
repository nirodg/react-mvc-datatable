import { Entity } from '../src/types/abstract-entity'

export interface User extends Entity {

    username?: string;
    email?: string;
    available?: boolean;

}