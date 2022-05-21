import { Direction } from "../data-structures/grid-3d";
import { Vector } from "../data-structures/vector3";

const startPositionContainer = new Vector(0, 0, 0);
const rayPathContainer = new Vector(0, 0, 0);

const isWithinBoundry = (min: number, max: number, value: number) => value >= min && value < max;

const getXIntersection = (cubePosition: Vector, rayStartPosition: Vector, rayPath: Vector, planeX: number) => {
    const top = cubePosition.y + 1;
    const bottom = cubePosition.y;
    const front = cubePosition.z + 1;
    const back = cubePosition.z;

    startPositionContainer.cloneFrom(rayStartPosition);
    rayPathContainer.cloneFrom(rayPath)

    const xDiff = planeX - rayStartPosition.x;
    const fraction = xDiff / rayPath.x;

    const collision = rayStartPosition.addMutate(rayPathContainer.multiplyMutate(fraction));
    const isCollisionOnTheCube = isWithinBoundry(bottom, top, collision.y) && isWithinBoundry(back, front, collision.z);

    if (isCollisionOnTheCube) return collision;

    return undefined;
}

const getYIntersection = (cubePosition: Vector, rayStartPosition: Vector, rayPath: Vector, planeY: number) => {
    const right = cubePosition.x + 1;
    const left = cubePosition.x;
    const front = cubePosition.z + 1;
    const back = cubePosition.z;

    startPositionContainer.cloneFrom(rayStartPosition);
    rayPathContainer.cloneFrom(rayPath)

    const yDiff = planeY - rayStartPosition.y;
    const fraction = yDiff / rayPath.y;

    const collision = rayStartPosition.addMutate(rayPathContainer.multiplyMutate(fraction));
    const isCollisionOnTheCube = isWithinBoundry(left, right, collision.x) && isWithinBoundry(back, front, collision.z);;

    if (isCollisionOnTheCube) return collision;

    return undefined;
}

const getZIntersection = (cubePosition: Vector, rayStartPosition: Vector, rayPath: Vector, planeZ: number) => {
    const right = cubePosition.x + 1;
    const left = cubePosition.x;
    const top = cubePosition.y + 1;
    const bottom = cubePosition.y;

    startPositionContainer.cloneFrom(rayStartPosition);
    rayPathContainer.cloneFrom(rayPath)

    const zDiff = planeZ - rayStartPosition.z;
    const fraction = zDiff / rayPath.z;

    const collision = rayStartPosition.addMutate(rayPathContainer.multiplyMutate(fraction));
    const isCollisionOnTheCube = isWithinBoundry(left, right, collision.x) && isWithinBoundry(bottom, top, collision.y);

    if (isCollisionOnTheCube) return collision;

    return undefined;
}

export const getRayCubeCollision = (rayStartPosition: Vector, rayPath: Vector, cubePosition: Vector) => {
    // Potential hit from the left
    if (rayPath.x > 0 && rayStartPosition.x < cubePosition.x) {
        const intersection = getXIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.x);
        if (intersection) return { intersection, direction: Direction.LEFT };
    }
    // Potential hit from the right
    if (rayPath.x < 0 && rayStartPosition.x > cubePosition.x + 1) {
        const intersection = getXIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.x + 1);
        if (intersection) return { intersection, direction: Direction.RIGHT };
    }

    // Potential hit from the bottom
    if (rayPath.y > 0 && rayStartPosition.y < cubePosition.y) {
        const intersection = getYIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.y);
        if (intersection) return { intersection, direction: Direction.BOTTOM };
    }
    // Potential hit from the top
    if (rayPath.y < 0 && rayStartPosition.y > cubePosition.y + 1) {
        const intersection = getYIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.y + 1);
        if (intersection) return { intersection, direction: Direction.TOP };
    }

    // Potential hit from the back
    if (rayPath.z > 0 && rayStartPosition.z < cubePosition.z) {
        const intersection = getZIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.z);
        if (intersection) return { intersection, direction: Direction.BACK };
    }
    // Potential hit from the front
    if (rayPath.z < 0 && rayStartPosition.z > cubePosition.z + 1) {
        const intersection = getZIntersection(cubePosition, rayStartPosition, rayPath, cubePosition.z + 1);
        if (intersection) return { intersection, direction: Direction.FRONT };
    }

    return {};
}