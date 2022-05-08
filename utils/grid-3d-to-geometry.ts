import * as THREE from "three";
import { Direction, Grid3D } from "../data-structures/grid-3d";

const DARK_RED_VERTICES = [
    0.7, 0.0, 0.0,
    0.7, 0.0, 0.0,
    0.7, 0.0, 0.0,
    0.7, 0.0, 0.0,
    0.7, 0.0, 0.0,
    0.7, 0.0, 0.0
];

const DARK_BLUE_VERTICES = [
    0.0, 0.0, 0.7,
    0.0, 0.0, 0.7,
    0.0, 0.0, 0.7,
    0.0, 0.0, 0.7,
    0.0, 0.0, 0.7,
    0.0, 0.0, 0.7
];

const DARK_GREEN_VERTICES = [
    0.0, 0.7, 0.0,
    0.0, 0.7, 0.0,
    0.0, 0.7, 0.0,
    0.0, 0.7, 0.0,
    0.0, 0.7, 0.0,
    0.0, 0.7, 0.0
];

export const grid3DToGeometry = (grid: Grid3D, resolution: number) => {
    const geometry = new THREE.BufferGeometry();
    const verticesArray: number[] = [];
    const colorsArray: number[] = [];

    grid.forEach((el, x, y, z) => {
        if (!el) return []
        const xPos = x * resolution;
        const yPos = y * resolution;
        const zPos = z * resolution;
        const offset = resolution / 2;

        if (!grid.hasNeighbour(Direction.FRONT, x, y, z)) {
            verticesArray.push(
                xPos - offset, yPos - offset, zPos + offset,
                xPos + offset, yPos - offset, zPos + offset,
                xPos + offset, yPos + offset, zPos + offset,

                xPos + offset, yPos + offset, zPos + offset,
                xPos - offset, yPos + offset, zPos + offset,
                xPos - offset, yPos - offset, zPos + offset
            )

            colorsArray.push(...DARK_GREEN_VERTICES);
        }

        if (!grid.hasNeighbour(Direction.BACK, x, y, z)) {
            verticesArray.push(
                xPos + offset, yPos + offset, zPos - offset,
                xPos + offset, yPos - offset, zPos - offset,
                xPos - offset, yPos - offset, zPos - offset,

                xPos - offset, yPos - offset, zPos - offset,
                xPos - offset, yPos + offset, zPos - offset,
                xPos + offset, yPos + offset, zPos - offset
            )

            colorsArray.push(...DARK_GREEN_VERTICES);
        }
        if (!grid.hasNeighbour(Direction.TOP, x, y, z)) {
            verticesArray.push(
                xPos - offset, yPos + offset, zPos - offset,
                xPos - offset, yPos + offset, zPos + offset,
                xPos + offset, yPos + offset, zPos + offset,

                xPos + offset, yPos + offset, zPos + offset,
                xPos + offset, yPos + offset, zPos - offset,
                xPos - offset, yPos + offset, zPos - offset
            )

            colorsArray.push(...DARK_RED_VERTICES);
        }
        if (!grid.hasNeighbour(Direction.BOTTOM, x, y, z)) {
            verticesArray.push(
                xPos + offset, yPos - offset, zPos + offset,
                xPos - offset, yPos - offset, zPos + offset,
                xPos - offset, yPos - offset, zPos - offset,

                xPos - offset, yPos - offset, zPos - offset,
                xPos + offset, yPos - offset, zPos - offset,
                xPos + offset, yPos - offset, zPos + offset
            )
            colorsArray.push(...DARK_RED_VERTICES);
        }
        if (!grid.hasNeighbour(Direction.LEFT, x, y, z)) {
            verticesArray.push(
                xPos - offset, yPos - offset, zPos - offset,
                xPos - offset, yPos - offset, zPos + offset,
                xPos - offset, yPos + offset, zPos + offset,

                xPos - offset, yPos + offset, zPos + offset,
                xPos - offset, yPos + offset, zPos - offset,
                xPos - offset, yPos - offset, zPos - offset
            )
            colorsArray.push(...DARK_BLUE_VERTICES);
        }
        if (!grid.hasNeighbour(Direction.RIGHT, x, y, z)) {
            verticesArray.push(
                xPos + offset, yPos + offset, zPos + offset,
                xPos + offset, yPos - offset, zPos + offset,
                xPos + offset, yPos - offset, zPos - offset,

                xPos + offset, yPos - offset, zPos - offset,
                xPos + offset, yPos + offset, zPos - offset,
                xPos + offset, yPos + offset, zPos + offset
            )
            colorsArray.push(...DARK_BLUE_VERTICES);
        }
    });

    const vertices = new Float32Array(verticesArray);
    const colors = new Float32Array(colorsArray)

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    return geometry;
}