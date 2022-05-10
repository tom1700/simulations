import { Grid2D } from "../data-structures/grid-2d";
import { Direction } from "../data-structures/grid-3d";
import { Plane } from "../data-structures/plane";
import { Vector } from "../data-structures/vector3";
import { getRayPlaneCollision } from "../utils/get-ray-plane-collision";
import { RayMonochrome } from "./ray-monochrome";

export class EyeMonochrome {
    private receptorsPlane: Plane;
    public receptors: Grid2D<number>;
    public position: Vector;
    public orientation: Direction;

    constructor(resolution: number, position: Vector, orientation: Direction) {
        this.receptors = new Grid2D<number>(resolution, resolution, 0xff000000);
        this.position = position;
        this.orientation = orientation;
        this.receptorsPlane = new Plane(this.position, orientation);
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

    private findIntersectionCoords(ray: RayMonochrome) {
        const collision = getRayPlaneCollision(this.receptorsPlane, ray);

        if (!collision) return;

        switch (this.orientation) {
            case Direction.FRONT:
            case Direction.BACK:
                return {
                    x: Math.floor((collision.x - this.position.x) * this.receptors.width),
                    y: Math.floor((collision.y - this.position.y) * this.receptors.height)
                }
            case Direction.TOP:
            case Direction.BOTTOM:
                return {
                    x: Math.floor((collision.x - this.position.x) * this.receptors.width),
                    y: Math.floor((collision.z - this.position.z) * this.receptors.height)
                }
            case Direction.LEFT:
            case Direction.RIGHT:
                return {
                    x: Math.floor((collision.z - this.position.z) * this.receptors.width),
                    y: Math.floor((collision.y - this.position.y) * this.receptors.height)
                }
        }
    }

    public reset() {
        this.receptors.resetBuffer(0);
    }


}