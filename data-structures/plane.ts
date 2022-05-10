import { Direction } from "./grid-3d";
import { Vector } from "./vector3";

export class Plane {
    public position: Vector;
    public direction: Direction;

    constructor(position: Vector, direction: Direction) {
        this.position = position;
        this.direction = direction;
    }

    public getX() {
        switch (this.direction) {
            case Direction.RIGHT:
                return this.position.x + 1;
            default:
                return this.position.x;
        }
    }

    public getY() {
        switch (this.direction) {
            case Direction.TOP:
                return this.position.y + 1;
            default:
                return this.position.y;
        }
    }

    public getZ() {
        switch (this.direction) {
            case Direction.FRONT:
                return this.position.z + 1;
            default:
                return this.position.z;
        }
    }
}