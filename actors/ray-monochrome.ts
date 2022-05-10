import { Vector } from "../data-structures/vector3";

export class RayMonochrome {
    public direction: Vector;
    public strength: number
    public startPosition: Vector;

    constructor(direction: Vector, startPosition: Vector, strength: number) {
        this.direction = direction;
        this.strength =  strength;
        this.startPosition = startPosition
    }
}