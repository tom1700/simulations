import { gasConstraint, gasConstraintSingle } from "./constraints/gas";
import { worldConstraint } from "./constraints/world";
import { Particle } from "./interfaces/particle";
import { ID } from "./interfaces/primitives";
import { Vector3 } from "./interfaces/vector3";
import {
  addNode,
  forEachNodeNeighbourWithinRange,
  LinkedListNode,
  resetGrid,
  SpatialGrid,
} from "./math/spatial-hashing";
import { applyAcceleration } from "./physics/apply-acceleration";
import { applyVelocity } from "./physics/apply-velocity";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
const GAS_INTERACTION_DISTANCE = 10;

export const runSimulationStep = (
  particleMap: Record<ID, Particle>,
  nodeList: LinkedListNode[],
  spatialGrid: SpatialGrid,
  worldSize: number,
  dt: number
) => {
  // 20000 particles - 78ms
  // 20000 particles no gas constraint - 32ms
  // For 20000 particles tree creation alone is 24ms
  console.time("step");

  for (let i = 0; i < nodeList.length; i++) {
    addNode(spatialGrid, nodeList[i]);
  }

  forEachNodeNeighbourWithinRange(
    (node1, node2) => {
      const particle1 = particleMap[node1.nodeId];
      const particle2 = particleMap[node2.nodeId];
      gasConstraintSingle(
        particle1,
        particle2,
        GAS_INTERACTION_DISTANCE + 1,
        dt
      );
    },
    spatialGrid,
    GAS_INTERACTION_DISTANCE
  );

  nodeList.forEach((node) => {
    const particle1 = particleMap[node.nodeId];

    applyAcceleration(particle1, gravity, dt);

    worldConstraint(particle1, worldSize);

    applyVelocity(particle1, dt);
  });

  resetGrid(spatialGrid);

  console.timeEnd("step");
};
