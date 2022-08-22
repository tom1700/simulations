import { ID } from "../interfaces/primitives";
import { Vector3 } from "../interfaces/vector3";

enum ChildPlacement {
    bottomLeftBack = 'bottomLeftBack',
    bottomLeftFront = 'bottomLeftFront',
    bottomRightBack = 'bottomRightBack',
    bottomRightFront = 'bottomRightFront',
    topLeftBack = 'topLeftBack',
    topLeftFront = 'topLeftFront',
    topRightBack = 'topRightBack',
    topRightFront = 'topRightFront',
}

export interface OctreeNode<T> {
    parent?: OctreeNode<T>;
    children: Record<ChildPlacement, OctreeNode<T> | undefined>;
    nodeId: ID;
    position: Vector3;
}

const placements = Object.values(ChildPlacement);

const conditions: Record<ChildPlacement, (rootPosition: Vector3, position: Vector3) => boolean> = {
    [ChildPlacement.bottomLeftBack]: (rootPosition: Vector3, position: Vector3) => position.x <= rootPosition.x && position.y <= rootPosition.y && position.z <= rootPosition.z,
    [ChildPlacement.bottomLeftFront]: (rootPosition: Vector3, position: Vector3) => position.x <= rootPosition.x && position.y <= rootPosition.y && position.z > rootPosition.z,
    [ChildPlacement.bottomRightBack]: (rootPosition: Vector3, position: Vector3) => position.x > rootPosition.x && position.y <= rootPosition.y && position.z <= rootPosition.z,
    [ChildPlacement.bottomRightFront]: (rootPosition: Vector3, position: Vector3) => position.x > rootPosition.x && position.y <= rootPosition.y && position.z > rootPosition.z,
    [ChildPlacement.topLeftBack]: (rootPosition: Vector3, position: Vector3) => position.x <= rootPosition.x && position.y > rootPosition.y && position.z <= rootPosition.z,
    [ChildPlacement.topLeftFront]: (rootPosition: Vector3, position: Vector3) => position.x <= rootPosition.x && position.y > rootPosition.y && position.z > rootPosition.z,
    [ChildPlacement.topRightBack]: (rootPosition: Vector3, position: Vector3) => position.x > rootPosition.x && position.y > rootPosition.y && position.z <= rootPosition.z,
    [ChildPlacement.topRightFront]: (rootPosition: Vector3, position: Vector3) => position.x > rootPosition.x && position.y > rootPosition.y && position.z > rootPosition.z,
}

export const addNode = <T>(root: OctreeNode<T>, position: Vector3, nodeId: ID) => {
    for (let placement of placements) {
        if (conditions[placement](root.position, position)) {
            const child = root.children[placement];
            if (!child) {
                root.children[placement] = {
                    nodeId, position, parent: root, children: {
                        bottomLeftBack: undefined,
                        bottomLeftFront: undefined,
                        bottomRightBack: undefined,
                        bottomRightFront: undefined,
                        topLeftBack: undefined,
                        topLeftFront: undefined,
                        topRightBack: undefined,
                        topRightFront: undefined,

                    }
                };
                return;
            }
            addNode(child, position, nodeId);
            return;
        }
    }
}

export const forEachNodeInRange = <T>(target: OctreeNode<T>, range: number) => {

}