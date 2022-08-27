import { Vector3 } from "../interfaces/vector3";
import { getDistance } from "./vector3";

interface LinkedListHead {
  next: LinkedListNode | null;
}

export interface LinkedListNode {
  nodeId: number;
  position: Vector3;
  next: LinkedListNode | null;
}

export type SpatialGrid = {
  size: number;
  cells: LinkedListHead[];
  spacing: number;
};

const to1D = (
  x: number,
  y: number,
  z: number,
  height: number,
  depth: number
) => {
  return (x * height + y) * depth + z;
};

const cordToIndex = (position: number, spacing: number) =>
  Math.floor(position / spacing);

const positionToGridIndex = (
  position: Vector3,
  size: number,
  spacing: number
) => {
  const x = cordToIndex(position.x, spacing);
  const y = cordToIndex(position.y, spacing);
  const z = cordToIndex(position.z, spacing);

  return to1D(x, y, z, size, size);
};

export const buildGrid = (worldSize: number, spacing: number): SpatialGrid => {
  const size = Math.ceil(worldSize / spacing);

  const cells: LinkedListHead[] = new Array(size * size * size)
    .fill(0)
    .map(() => ({
      next: null,
    }));

  return {
    size,
    cells,
    spacing,
  };
};

export const addNode = (grid: SpatialGrid, node: LinkedListNode) => {
  const { size, cells, spacing } = grid;

  const index = positionToGridIndex(node.position, size, spacing);

  // Rouge particle
  if (index > grid.cells.length - 1 || index < 0) return;

  const first = cells[index].next;

  if (!first) {
    node.next = null;
  } else {
    node.next = first;
  }

  cells[index].next = node;
};

export const resetGrid = (grid: SpatialGrid) => {
  grid.cells.forEach((head) => {
    let nextNode = head.next;
    head.next = null;

    while (nextNode) {
      const savedNextNode = nextNode.next;
      nextNode.next = null;
      nextNode = savedNextNode;
    }
  });
};

const forEachNodeInCellExceptTarget = (
  callback: (node: LinkedListNode, neighbour: LinkedListNode) => void,
  head: LinkedListHead,
  target: LinkedListNode
) => {
  let node = head.next;

  while (node) {
    if (node !== target) {
      callback(target, node);
    }
    node = node.next;
  }
};

export const forEachNodeNeighbourWithinRange = (
  callback: (node: LinkedListNode, neighbour: LinkedListNode) => void,
  grid: SpatialGrid,
  distance: number
) => {
  const neighboursDepthToCheck = Math.ceil(distance / grid.spacing);

  const callIfInRange = (node: LinkedListNode, neighbour: LinkedListNode) => {
    if (getDistance(node.position, neighbour.position) <= distance) {
      callback(node, neighbour);
    }
  };

  for (let i = 0; i < grid.cells.length; i++) {
    const head = grid.cells[i];

    let index = i;
    const x = Math.floor(index / (grid.size * grid.size));
    index -= x * grid.size * grid.size;
    const y = Math.floor(index / grid.size);
    const z = index % grid.size;

    for (
      let nx = Math.max(x - neighboursDepthToCheck, 0);
      nx < Math.min(x + neighboursDepthToCheck, grid.size);
      nx++
    ) {
      for (
        let ny = Math.max(y - neighboursDepthToCheck, 0);
        ny < Math.min(y + neighboursDepthToCheck, grid.size);
        ny++
      ) {
        for (
          let nz = Math.max(z - neighboursDepthToCheck, 0);
          nz < Math.min(z + neighboursDepthToCheck, grid.size);
          nz++
        ) {
          let node = head.next;

          while (node) {
            const i2 = to1D(x, y, z, grid.size, grid.size);
            const head2 = grid.cells[i2];
            forEachNodeInCellExceptTarget(callIfInRange, head2, node);
            node = node.next;
          }
        }
      }
    }
  }
};
