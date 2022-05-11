import { EyeMonochrome } from "../actors/eye-monochrome";
import { RayMonochrome } from "../actors/ray-monochrome";
import { Grid3D } from "../data-structures/grid-3d";
import { Vector } from "../data-structures/vector3";
import { getRayCubeCollision } from "./get-ray-cube-collision";

const RAY_STRENGTH = 100;

const forEachDirection = (callback: (vector: Vector) => void, samples: number) => {
    const phi = Math.PI * (3. - Math.sqrt(5.))  // golden angle in radians

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2  // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y)  // radius at y

        const theta = phi * i  // golden angle increment
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius

        callback(new Vector(x, y, z))
    }
}

// I'm reusing them for performance reasons
const newPosition = new Vector(0, 0, 0);
const incrementVector = new Vector(0, 0, 0);

const castRay = (ray: RayMonochrome, grid: Grid3D, eye: EyeMonochrome) => {
    newPosition.copyMutate(ray.startPosition);
    incrementVector.copyMutate(ray.direction).multiplyMutate(0.1)

    while (ray.strength >= 1) {
        newPosition.addMutate(incrementVector);

        const x = Math.floor(newPosition.x);
        const y = Math.floor(newPosition.y);
        const z = Math.floor(newPosition.z);

        const value = grid.getValue(x, y, z)

        if (value === undefined) {
            return;
        }

        if (value === 'eye') {
            const collisionRay = new RayMonochrome(incrementVector.clone(), ray.startPosition.clone(), RAY_STRENGTH);

            eye.updateByRay(collisionRay);
        }

        if (value === 'ground') {
            const collision = getRayCubeCollision(ray.startPosition.clone(), incrementVector.clone(), new Vector(x, y, z));

            if (!collision) return;

            ray.startPosition.copyMutate(collision);
            if (collision.y === y || collision.y === y + 1) {
                ray.direction.y = ray.direction.y * -1;
            }
            if (collision.x === x || collision.x === x + 1) {
                ray.direction.x = ray.direction.x * -1;
            }
            if (collision.z === z || collision.z === z + 1) {
                ray.direction.z = ray.direction.z * -1;
            }
            incrementVector.copyMutate(ray.direction).multiplyMutate(0.1);
            ray.strength /= 2;

            continue;
        };

        ray.startPosition.copyMutate(newPosition);
    }
}

export const castRays = (grid: Grid3D, eye: EyeMonochrome, lightSourcePosition: Vector, raysAmount: number) => {
    forEachDirection((direction) => {
        const ray = new RayMonochrome(direction, lightSourcePosition.clone(), 255);
        castRay(ray, grid, eye);
    }, raysAmount)
}