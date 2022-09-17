import { gasConstraintSingle } from "./constraints/gas";
import { worldConstraint } from "./constraints/world";
import { Particle } from "./interfaces/particle";
import { ID } from "./interfaces/primitives";
import { Vector3 } from "./interfaces/vector3";
import {
  addParticle,
  forEachParticleNeighbourWithinRange,
  resetGrid,
  SpatialGrid,
} from "./physics/spatial-hashing";
import { applyAcceleration } from "./physics/apply-acceleration";
import { applyVelocity } from "./physics/apply-velocity";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
const GAS_INTERACTION_DISTANCE = 10;

export const runSimulationStep = (
  particleMap: Record<ID, Particle>,
  particles: Particle[],
  spatialGrid: SpatialGrid,
  worldSize: number,
  dt: number
) => {
  // 20000 particles - 78ms
  // 20000 particles no gas constraint - 32ms
  // For 20000 particles tree creation alone is 24ms
  console.time("step");

  for (let i = 0; i < particles.length; i++) {
    addParticle(spatialGrid, particles[i]);
  }

  forEachParticleNeighbourWithinRange(
    (particle1Id, particle2Id) => {
      const particle1 = particleMap[particle1Id];
      const particle2 = particleMap[particle2Id];
      gasConstraintSingle(
        particle1,
        particle2,
        GAS_INTERACTION_DISTANCE + 1,
        dt
      );
    },
    spatialGrid,
    particleMap,
    GAS_INTERACTION_DISTANCE
  );

  particles.forEach((particle) => {
    applyAcceleration(particle, gravity, dt);

    worldConstraint(particle, worldSize);

    applyVelocity(particle, dt);
  });

  resetGrid(spatialGrid);

  console.timeEnd("step");
};
