import { ID } from "../interfaces/primitives";
import { Vector3 } from "../interfaces/vector3";
import { getDistance } from "./vector3";

enum ChildPlacement {
  bottomLeftBack = "bottomLeftBack",
  bottomLeftFront = "bottomLeftFront",
  bottomRightBack = "bottomRightBack",
  bottomRightFront = "bottomRightFront",
  topLeftBack = "topLeftBack",
  topLeftFront = "topLeftFront",
  topRightBack = "topRightBack",
  topRightFront = "topRightFront",
}

export interface OctreeNode {
  parent?: OctreeNode;
  children: Partial<Record<ChildPlacement, OctreeNode>>;
  nodeId: ID;
  position: Vector3;
}

const placements = Object.values(ChildPlacement);

const frontPlacements = [
  ChildPlacement.bottomLeftFront,
  ChildPlacement.bottomRightFront,
  ChildPlacement.topLeftFront,
  ChildPlacement.topRightFront,
];

const backPlacements = [
  ChildPlacement.bottomLeftBack,
  ChildPlacement.bottomRightBack,
  ChildPlacement.topLeftBack,
  ChildPlacement.topRightBack,
];

const leftPlacements = [
  ChildPlacement.topLeftFront,
  ChildPlacement.topLeftBack,
  ChildPlacement.bottomLeftFront,
  ChildPlacement.bottomLeftBack,
];

const rightPlacements = [
  ChildPlacement.topRightFront,
  ChildPlacement.topRightBack,
  ChildPlacement.bottomRightFront,
  ChildPlacement.bottomRightBack,
];

const topPlacements = [
  ChildPlacement.topRightFront,
  ChildPlacement.topRightBack,
  ChildPlacement.topLeftFront,
  ChildPlacement.topLeftBack,
];

const bottomPlacements = [
  ChildPlacement.bottomRightFront,
  ChildPlacement.bottomRightBack,
  ChildPlacement.bottomLeftFront,
  ChildPlacement.bottomLeftBack,
];

const topFrontPlacements = [
  ChildPlacement.topRightFront,
  ChildPlacement.topLeftFront,
];

const topBackPlacements = [
  ChildPlacement.topRightBack,
  ChildPlacement.topLeftBack,
];

const bottomBackPlacements = [
  ChildPlacement.bottomRightBack,
  ChildPlacement.bottomLeftBack,
];

const bottomFrontPlacements = [
  ChildPlacement.bottomRightFront,
  ChildPlacement.bottomLeftFront,
];

const leftFrontPlacements = [
  ChildPlacement.bottomLeftFront,
  ChildPlacement.topLeftFront,
];

const leftBackPlacements = [
  ChildPlacement.bottomLeftBack,
  ChildPlacement.topLeftBack,
];

const rightBackPlacements = [
  ChildPlacement.bottomRightBack,
  ChildPlacement.topRightBack,
];

const rightFrontPlacements = [
  ChildPlacement.bottomRightFront,
  ChildPlacement.topRightFront,
];

const topRightPlacements = [
  ChildPlacement.topRightBack,
  ChildPlacement.topRightFront,
];

const bottomLeftPlacements = [
  ChildPlacement.bottomLeftBack,
  ChildPlacement.bottomLeftFront,
];

const bottomRightPlacements = [
  ChildPlacement.bottomRightBack,
  ChildPlacement.bottomRightFront,
];

const topLeftPlacements = [
  ChildPlacement.topLeftBack,
  ChildPlacement.topLeftFront,
];

const oppositePlacement: Record<ChildPlacement, ChildPlacement[]> = {
  [ChildPlacement.bottomLeftBack]: [ChildPlacement.topRightFront],
  [ChildPlacement.bottomLeftFront]: [ChildPlacement.topRightBack],
  [ChildPlacement.bottomRightBack]: [ChildPlacement.topLeftFront],
  [ChildPlacement.bottomRightFront]: [ChildPlacement.topLeftBack],
  [ChildPlacement.topLeftBack]: [ChildPlacement.bottomRightFront],
  [ChildPlacement.topLeftFront]: [ChildPlacement.bottomRightBack],
  [ChildPlacement.topRightBack]: [ChildPlacement.bottomLeftFront],
  [ChildPlacement.topRightFront]: [ChildPlacement.bottomLeftBack],
};

const conditions: Record<
  ChildPlacement,
  (rootPosition: Vector3, position: Vector3) => boolean
> = {
  [ChildPlacement.bottomLeftBack]: (rootPosition: Vector3, position: Vector3) =>
    position.x <= rootPosition.x &&
    position.y <= rootPosition.y &&
    position.z <= rootPosition.z,
  [ChildPlacement.bottomLeftFront]: (
    rootPosition: Vector3,
    position: Vector3
  ) =>
    position.x <= rootPosition.x &&
    position.y <= rootPosition.y &&
    position.z > rootPosition.z,
  [ChildPlacement.bottomRightBack]: (
    rootPosition: Vector3,
    position: Vector3
  ) =>
    position.x > rootPosition.x &&
    position.y <= rootPosition.y &&
    position.z <= rootPosition.z,
  [ChildPlacement.bottomRightFront]: (
    rootPosition: Vector3,
    position: Vector3
  ) =>
    position.x > rootPosition.x &&
    position.y <= rootPosition.y &&
    position.z > rootPosition.z,
  [ChildPlacement.topLeftBack]: (rootPosition: Vector3, position: Vector3) =>
    position.x <= rootPosition.x &&
    position.y > rootPosition.y &&
    position.z <= rootPosition.z,
  [ChildPlacement.topLeftFront]: (rootPosition: Vector3, position: Vector3) =>
    position.x <= rootPosition.x &&
    position.y > rootPosition.y &&
    position.z > rootPosition.z,
  [ChildPlacement.topRightBack]: (rootPosition: Vector3, position: Vector3) =>
    position.x > rootPosition.x &&
    position.y > rootPosition.y &&
    position.z <= rootPosition.z,
  [ChildPlacement.topRightFront]: (rootPosition: Vector3, position: Vector3) =>
    position.x > rootPosition.x &&
    position.y > rootPosition.y &&
    position.z > rootPosition.z,
};

export const addNode = (root: OctreeNode, node: OctreeNode) => {
  for (let i = 0; i < placements.length; i++) {
    const placement = placements[i];
    if (conditions[placement](root.position, node.position)) {
      const child = root.children[placement];

      if (!child) {
        root.children[placement] = node;
        node.parent = root;
        return;
      }
      addNode(child, node);
      return;
    }
  }
};

export const unbindNodes = (node: OctreeNode) => {
  node.parent = undefined;

  for (let i = 0; i < placements.length; i++) {
    const placement = placements[i];
    const child = node.children[placement];
    if (child) {
      unbindNodes(child);
      node.children[placement] = undefined;
    }
  }
};

export const getPlacementsToCheck = (
  xInRange: boolean,
  yInRange: boolean,
  zInRange: boolean,
  direction: ChildPlacement
) => {
  const isOnTheRight = rightPlacements.includes(direction);
  const isOnTheTop = topPlacements.includes(direction);
  const isOnTheFront = frontPlacements.includes(direction);

  if (xInRange) {
    if (yInRange) {
      if (zInRange) {
        return placements;
      }

      if (isOnTheFront) return backPlacements;

      return frontPlacements;
    }

    if (zInRange) {
      if (isOnTheTop) return bottomPlacements;

      return topPlacements;
    }

    if (isOnTheTop) {
      if (isOnTheFront) return bottomBackPlacements;

      return bottomFrontPlacements;
    }

    if (isOnTheFront) return topBackPlacements;

    return topFrontPlacements;
  }

  if (yInRange) {
    if (zInRange) {
      if (isOnTheRight) return leftPlacements;

      return rightPlacements;
    }

    if (isOnTheFront) {
      if (isOnTheRight) return leftBackPlacements;
      return rightBackPlacements;
    }

    if (isOnTheRight) return leftFrontPlacements;

    return rightFrontPlacements;
  }

  if (zInRange) {
    if (isOnTheRight) {
      if (isOnTheTop) return bottomLeftPlacements;

      return topLeftPlacements;
    }

    if (isOnTheTop) return bottomRightPlacements;

    return topRightPlacements;
  }

  return oppositePlacement[direction];
};

const forNodesInDirectionInRange = (
  callback: (node1: OctreeNode, node2: OctreeNode) => void,
  target: OctreeNode,
  node: OctreeNode,
  direction: ChildPlacement,
  range: number
) => {
  if (node === target) return;
  const xInRange = Math.abs(target.position.x - node.position.x) <= range;
  const yInRange = Math.abs(target.position.y - node.position.y) <= range;
  const zInRange = Math.abs(target.position.z - node.position.z) <= range;
  const placementsToCheck = getPlacementsToCheck(
    xInRange,
    yInRange,
    zInRange,
    direction
  );

  if (xInRange && yInRange && zInRange) {
    callback(target, node);
  }

  for (let i = 0; i < placementsToCheck.length; i++) {
    const placement = placementsToCheck[i];
    const child = node.children[placement];

    if (child) {
      forNodesInDirectionInRange(callback, target, child, direction, range);
    }
  }
};

const forEachChildNodeInRange = (
  callback: (node1: OctreeNode, node2: OctreeNode) => void,
  node: OctreeNode,
  range: number
) => {
  for (let placement of placements) {
    const child = node.children[placement];

    if (child) {
      forNodesInDirectionInRange(callback, node, child, placement, range);
    }
  }
};

export const forEachNodePairs = (
  callback: (node1: OctreeNode, node2: OctreeNode) => void,
  root: OctreeNode,
  range: number
) => {
  forEachChildNodeInRange(callback, root, range);

  for (let i = 0; i < placements.length; i++) {
    const child = root.children[placements[i]];
    if (!child) continue;

    forEachNodePairs(callback, child, range);

    for (let j = i + 1; j < placements.length; j++) {
      const sibling = root.children[placements[j]];
      if (!sibling) continue;

      const siblingRelativePlacement = placements.find((placement) =>
        conditions[placement](child.position, sibling.position)
      );

      if (!siblingRelativePlacement) continue;

      forNodesInDirectionInRange(
        callback,
        child,
        sibling,
        siblingRelativePlacement,
        range
      );
    }
  }
};
