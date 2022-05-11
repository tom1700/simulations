import { Grid2D } from "../data-structures/grid-2d";
import { Direction } from "../data-structures/grid-3d";
import { Plane } from "../data-structures/plane";
import { Vector } from "../data-structures/vector3";
import { getRayCubeCollision } from "../utils/get-ray-cube-collision";
import { RayMonochrome } from "./ray-monochrome";

export class EyeMonochrome {
    public receptors: Grid2D<number>;
    public position: Vector;
    public orientation: Direction;

    constructor(resolution: number, position: Vector, orientation: Direction) {
        this.receptors = new Grid2D<number>(resolution, resolution, 0xff000000);
        this.position = position;
        this.orientation = orientation;
    }

    public updateByRay(ray: RayMonochrome) {
        const intersection = this.findIntersectionCoords(ray);
        if (!intersection) return;

        const currentValue = parseInt(this.receptors.getValue(intersection.x, intersection.y)?.toString(16).slice(-2) || '0');
        const newValue = Math.min(currentValue + ray.strength, 255);
        const newValueString = newValue.toString(16);
        const newColorValue = parseInt(`0xff${newValueString}${newValueString}${newValueString}`, 16);
        this.receptors.setValue(intersection.x, intersection.y, newColorValue);
    }

    public updateByCollision(collision: Vector) {

    }
    
    private findIntersectionCoords(ray: RayMonochrome) {
        const { intersection, direction } = getRayCubeCollision(ray.startPosition, ray.direction, this.position);

        if (!intersection || this.orientation !== direction) return;

        switch (this.orientation) {
            case Direction.FRONT:
            case Direction.BACK:
                return {
                    x: Math.floor((intersection.x - this.position.x) * this.receptors.width),
                    y: Math.floor((intersection.y - this.position.y) * this.receptors.height)
                }
            case Direction.TOP:
            case Direction.BOTTOM:
                return {
                    x: Math.floor((intersection.x - this.position.x) * this.receptors.width),
                    y: Math.floor((intersection.z - this.position.z) * this.receptors.height)
                }
            case Direction.LEFT:
            case Direction.RIGHT:
                return {
                    x: Math.floor((intersection.z - this.position.z) * this.receptors.width),
                    y: Math.floor((intersection.y - this.position.y) * this.receptors.height)
                }
        }
    }

    public reset() {
        this.receptors.resetBuffer(0);
    }


}