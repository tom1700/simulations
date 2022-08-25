import { gasConstraint } from "./constraints/gas";
import { worldConstraint } from "./constraints/world";
import { Particle } from "./interfaces/particle";
import { ID } from "./interfaces/primitives";
import { Vector3 } from "./interfaces/vector3";
import { addNode, forEachNode, forEachNodeInRange, OctreeNode, unbindNodes } from "./math/octree";
import { applyAcceleration } from "./physics/apply-acceleration";
import { applyVelocity } from "./physics/apply-velocity";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
const GAS_INTERACTION_DISTANCE = 10;

export const runSimulationStep = (particleMap: Record<ID, Particle>, nodes: OctreeNode[], worldSize: number, dt: number) => {
  // 1008 particles - 20ms
  console.time('step')
  const root = nodes[0];


  for (let i = 1; i < nodes.length; i++) {
    addNode(root, nodes[i]);
  }


  forEachNode((node) => {
    const particle1 = particleMap[node.nodeId];

    applyAcceleration(particle1, gravity, dt);

    forEachNodeInRange((node2) => {
      const particle2 = particleMap[node2.nodeId];
      gasConstraint(particle1, particle2, GAS_INTERACTION_DISTANCE + 1, dt);
    }, node, GAS_INTERACTION_DISTANCE)

    worldConstraint(particle1, worldSize);

    applyVelocity(particle1, dt);
  }, root);

  unbindNodes(root);

  console.timeEnd('step')
}