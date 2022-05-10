import { Grid2D } from "../data-structures/grid-2d";
import { Direction } from "../data-structures/grid-3d";
import { Vector } from "../data-structures/vector3";
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
        const newValue = Math.min(currentValue + Math.floor((Math.random() * 256)), 255);
        const newValueString = newValue.toString(16);
        const newColorValue = parseInt(`0xff${newValueString}${newValueString}${newValueString}`, 16);
        this.receptors.setValue(intersection.x, intersection.y, newColorValue);
    }

    private findIntersectionCoords(ray: RayMonochrome) {
        if (this.orientation === Direction.TOP) {
            if (ray.startPosition.y < this.position.y + 1) {
                return;
            }
        }

        if (this.orientation === Direction.BACK) {
            if (ray.startPosition.z > this.position.z) {
                return;
            }
            const zDiff = this.position.z - ray.startPosition.z;
            const partOfVector = zDiff / ray.direction.z;
            const collision = ray.startPosition.add(ray.direction.multiply(partOfVector));
            const x = Math.floor((collision.x - this.position.x) * this.receptors.width);
            const y = Math.floor((collision.y - this.position.y) * this.receptors.width);

            return { x, y };
        }
    }

    public reset() {
        this.receptors.resetBuffer(0);
    }


}