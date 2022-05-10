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

    public updateByRay(ray?: RayMonochrome) {
        const x = Math.floor(Math.random() * this.receptors.width);
        const y = Math.floor(Math.random() * this.receptors.height);
        const currentValue = parseInt(this.receptors.getValue(x, y)?.toString(16).slice(-2) || '0');
        const newValue = Math.min(currentValue + Math.floor((Math.random() * 256)), 255);
        const newValueString = newValue.toString(16);
        const newColorValue = parseInt(`0xff${newValueString}${newValueString}${newValueString}`, 16);
        const colorValue = `${newValue}${newValue}`;
        this.receptors.setValue(x, y, newColorValue);
    }

    public reset() {
        this.receptors.resetBuffer(0);
    }


}