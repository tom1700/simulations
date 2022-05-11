import { RayMonochrome } from "../actors/ray-monochrome";
import { Direction } from "../data-structures/grid-3d";
import { Plane } from "../data-structures/plane";
import { Vector } from "../data-structures/vector3";

// I'm reusing the instances for performance reasons
const rayStartPosition = new Vector(0, 0, 0);
const rayDirection = new Vector(0, 0, 0);

const getVectorFraction = (plane: Plane, rayStartPosition: Vector, rayDirection: Vector) => {
    const planeX = plane.getX();
    const planeZ = plane.getZ();
    const planeY = plane.getY();

    switch (plane.direction) {
        case Direction.BACK:
        case Direction.FRONT: {
            const zDiff = planeZ - rayStartPosition.z;
            return zDiff / rayDirection.z;
        }
        case Direction.BOTTOM:
        case Direction.TOP: {
            const yDiff = planeY - rayStartPosition.y;
            return yDiff / rayDirection.y;
        }
        case Direction.LEFT:
        case Direction.RIGHT: {
            const xDiff = planeX - rayStartPosition.x;
            return xDiff / rayDirection.x;
        }
        default:
            return 1;
    }
}

const getVectorCollision = (plane: Plane, rayStartPosition: Vector, rayDirection: Vector) => {
    const vectorFraction = getVectorFraction(plane, rayStartPosition, rayDirection);

    return rayStartPosition.addMutate(rayDirection.multiplyMutate(vectorFraction));
}

const isWithinBoundry = (min: number, max: number, value: number) => value >= min && value < max;

const verifyCollision = (collision: Vector, plane: Plane) => {
    const right = plane.position.x + 1;
    const left = plane.position.x;
    const top = plane.position.y + 1;
    const bottom = plane.position.y;
    const front = plane.position.z + 1;
    const back = plane.position.z;


    switch (plane.direction) {
        case Direction.BACK:
        case Direction.FRONT:
            return isWithinBoundry(left, right, collision.x) && isWithinBoundry(bottom, top, collision.y);
        case Direction.BOTTOM:
        case Direction.TOP:
            return isWithinBoundry(left, right, collision.x) && isWithinBoundry(back, front, collision.z);
        case Direction.LEFT:
        case Direction.RIGHT:
            return isWithinBoundry(bottom, top, collision.y) && isWithinBoundry(back, front, collision.z);
        default:
            return true;
    }
}

const verifyStartPosition = (rayStartPosition: Vector, plane: Plane) => {
    const planeX = plane.getX();
    const planeZ = plane.getZ();
    const planeY = plane.getY();

    switch (plane.direction) {
        case Direction.BACK: return rayStartPosition.z < planeZ;
        case Direction.FRONT: return rayStartPosition.z > planeZ;
        case Direction.BOTTOM: return rayStartPosition.y < planeY;
        case Direction.TOP: return rayStartPosition.y > planeY;
        case Direction.LEFT: return rayStartPosition.x < planeX;
        case Direction.RIGHT: return rayStartPosition.x > planeX;
    }
}

export const getRayPlaneCollision = (plane: Plane, ray: RayMonochrome) => {
    rayStartPosition.copyMutate(ray.startPosition);
    rayDirection.copyMutate(ray.direction);
    
    if (!verifyStartPosition(rayStartPosition, plane)) return;


    const collision = getVectorCollision(plane, rayStartPosition, rayDirection);

    if (!verifyCollision(collision, plane)) return;

    return collision;
}