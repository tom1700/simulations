import { EyeMonochrome } from "../actors/eye-monochrome";
import { RayMonochrome } from "../actors/ray-monochrome";
import { Grid3D } from "../data-structures/grid-3d";
import { Vector } from "../data-structures/vector3";

const fibonacciSphere = (samples: number) => {
    const points = []
    const phi = Math.PI * (3. - Math.sqrt(5.))  // golden angle in radians

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2  // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y)  // radius at y

        const theta = phi * i  // golden angle increment
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius

        points.push(new Vector(x, y, z));
    }

    return points;
}

const castRay = (lightSourcePosition: Vector, ray: Vector, grid: Grid3D, eye: EyeMonochrome) => {
    const currentPosition = lightSourcePosition.clone();
    const newPosition = lightSourcePosition.clone();
    const incrementVector = ray.multiply(0.1);

    while (true) {
        newPosition.addMutate(incrementVector);

        const x = Math.floor(newPosition.x);
        const y = Math.floor(newPosition.y);
        const z = Math.floor(newPosition.z);

        const value = grid.getValue(x, y, z)
        
        if (value === undefined) {
            return;
        }
        
        if (value === 'eye') {
            console.log('eye')
            const collisionRay = new RayMonochrome(incrementVector.clone(), currentPosition.clone(), 255);

            eye.updateByRay(collisionRay)
        }

        if (value === 'ground') return;

        currentPosition.copyMutate(newPosition);
    }
}

export const castRays = (grid: Grid3D, eye: EyeMonochrome, lightSourcePosition: Vector, raysAmount: number) => {
    const rays = fibonacciSphere(raysAmount);

    rays.forEach((ray) => {
        castRay(lightSourcePosition, ray, grid, eye);
    })
}