import { gasConstraint, gasConstraintSingle } from "./constraints/gas";
import { worldConstraint } from "./constraints/world";
import { Particle } from "./interfaces/particle";
import { ID } from "./interfaces/primitives";
import { Vector3 } from "./interfaces/vector3";
import {
  addNode,
  forEachNodeNeighbourWithinRange,
  getParticlesAndNeighbours,
  LinkedListNode,
  resetGrid,
  SpatialGrid,
} from "./math/spatial-hashing";
import { applyAcceleration } from "./physics/apply-acceleration";
import { applyVelocity } from "./physics/apply-velocity";
import { WorkersScheduler } from "./workers-scheduler";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
const GAS_INTERACTION_DISTANCE = 10;

export const runSimulationStep = async (
  particleMap: Record<ID, Particle>,
  nodeList: LinkedListNode[],
  spatialGrid: SpatialGrid,
  worldSize: number,
  dt: number,
  workScheduler: WorkersScheduler
) => {
  // 20000 particles - 78ms
  // 20000 particles no gas constraint - 32ms
  // For 20000 particles tree creation alone is 24ms
  console.time("step");

  for (let i = 0; i < nodeList.length; i++) {
    addNode(spatialGrid, nodeList[i]);
  }

  for (let i = 0; i < spatialGrid.cells.length; i++) {
    const { particles, neighbours } = getParticlesAndNeighbours(
      particleMap,
      spatialGrid,
      GAS_INTERACTION_DISTANCE,
      i
    );

    workScheduler.scheduleTask(
      (worker) =>
        new Promise<void>((res) => {
          const onMessage = (event: MessageEvent<any>) => {
            worker.removeEventListener("message", onMessage);
            const particles: Particle[] = event.data.particles;

            particles.forEach((particle) => {
              particleMap[particle.id].velocity = particle.velocity;
            });
            res();
          };

          worker.addEventListener("message", onMessage);

          worker.postMessage({
            particles,
            neighbouringParticles: neighbours,
            distance: GAS_INTERACTION_DISTANCE,
            dt,
          });
        })
    );
  }

  await workScheduler.run();

  nodeList.forEach((node) => {
    const particle1 = particleMap[node.nodeId];

    applyAcceleration(particle1, gravity, dt);

    worldConstraint(particle1, worldSize);

    applyVelocity(particle1, dt);
  });

  resetGrid(spatialGrid);

  console.timeEnd("step");
};
