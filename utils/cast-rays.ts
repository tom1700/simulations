import { EyeMonochrome } from "../actors/eye-monochrome";
import { RayMonochrome } from "../actors/ray-monochrome";
import { Direction, Grid3D } from "../data-structures/grid-3d";
import { Vector } from "../data-structures/vector3";
import { getRayCubeCollision } from "./get-ray-cube-collision";

const RAY_STRENGTH = 255;

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
const rayLenght1D = new Vector(0, 0, 0);
const rayUnitStepSize = new Vector(0, 0, 0);
const currentCell = new Vector(0, 0, 0);
const step = new Vector(0, 0, 0);
const direction = new Vector(0,0,0);

const initializeRayVectors = (ray: RayMonochrome, grid: Grid3D) => {
    currentCell.cloneFrom(ray.startPosition).floorMutate();
    direction.cloneFrom(ray.direction);
    rayUnitStepSize.x = Math.sqrt(1 + Math.pow((ray.direction.y / ray.direction.x), 2) + Math.pow((ray.direction.z / ray.direction.x), 2));
    rayUnitStepSize.y = Math.sqrt(1 + Math.pow((ray.direction.x / ray.direction.y), 2) + Math.pow((ray.direction.z / ray.direction.y), 2));
    rayUnitStepSize.z = Math.sqrt(1 + Math.pow((ray.direction.x / ray.direction.z), 2) + Math.pow((ray.direction.y / ray.direction.z), 2));

    if (ray.direction.x < 0) {
        step.x = -1;
        rayLenght1D.x = (ray.startPosition.x - currentCell.x) * rayUnitStepSize.x;
    } else {
        rayLenght1D.x = (currentCell.x + 1 - ray.startPosition.x) * rayUnitStepSize.x;
        step.x = 1;
    }

    if (ray.direction.y < 0) {
        rayLenght1D.y = (ray.startPosition.y - currentCell.y) * rayUnitStepSize.y;
        step.y = -1;
    } else {
        rayLenght1D.y = (currentCell.y + 1 - ray.startPosition.y) * rayUnitStepSize.y;
        step.y = 1;
    }

    if (ray.direction.z < 0) {
        rayLenght1D.z = (ray.startPosition.z - currentCell.z) * rayUnitStepSize.z;
        step.z = -1;
    } else {
        rayLenght1D.z = (currentCell.z + 1 - ray.startPosition.z) * rayUnitStepSize.z;
        step.z = 1;
    }
}

const castRay = (ray: RayMonochrome, grid: Grid3D, eye: EyeMonochrome) => {
    let distance = 0;
    initializeRayVectors(ray, grid);

    while (ray.strength >= 1) {
        if (rayLenght1D.x < rayLenght1D.y && rayLenght1D.x < rayLenght1D.z) {
            currentCell.x += step.x;
            distance = rayLenght1D.x;
            rayLenght1D.x += rayUnitStepSize.x;
        } else if (rayLenght1D.y < rayLenght1D.x && rayLenght1D.y < rayLenght1D.z) {
            currentCell.y += step.y;
            distance = rayLenght1D.y;
            rayLenght1D.y += rayUnitStepSize.y;
        } else {
            currentCell.z += step.z;
            distance = rayLenght1D.z;
            rayLenght1D.z += rayUnitStepSize.z;
        }

        const value = grid.getValue(currentCell.x, currentCell.y, currentCell.z)

        if (value === undefined) {
            return;
        }

        if (value) {
            const intersectionRay = new RayMonochrome(direction.multiplyMutate(distance*1.000001), ray.startPosition, ray.strength);
 
            if (value === 'eye') {
                eye.updateByRay(intersectionRay);
            }

            if (value === 'ground') {
                const { direction, intersection } = getRayCubeCollision(ray.startPosition, intersectionRay.direction, currentCell);
    
                if (!intersection) return;
    
                ray.startPosition.cloneFrom(intersection);
    
                if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                    ray.direction.y = ray.direction.y * -1;
                }
                if (direction === Direction.LEFT || direction === Direction.RIGHT) {
                    ray.direction.x = ray.direction.x * -1;
                }
                if (direction === Direction.BACK || direction === Direction.FRONT) {
                    ray.direction.z = ray.direction.z * -1;
                }
    
                initializeRayVectors(ray, grid);
                distance=0;
    
                ray.strength /= 2;
                continue;
            };

            return;
        }
    }
}

export const castRays = (grid: Grid3D, eye: EyeMonochrome, lightSourcePosition: Vector, raysAmount: number) => {
    console.time('Ray Casting')
    forEachDirection((direction) => {
        const ray = new RayMonochrome(direction, lightSourcePosition.clone(), RAY_STRENGTH);
        castRay(ray, grid, eye);
    }, raysAmount)
    console.timeEnd('Ray Casting')
}