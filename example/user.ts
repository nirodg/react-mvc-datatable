import { Entity } from '../src/types/entity'

export interface User extends Entity {

    username?: string;
    email?: string;
    available?: boolean;

}