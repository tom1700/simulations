import { worldConstraintV2 } from "./constraints/world";
import { Vector3 } from "./interfaces/vector3";
import {
  addParticle,
  applyConstraints,
  resetGrid,
  SpatialGrid,
} from "./physics/spatial-hashing";
import { applyAccelerationV2 } from "./physics/apply-acceleration";
import { applyVelocityV2 } from "./physics/apply-velocity";
import { ParticleLens } from "./physics/particle-lens";
import { IKernelRunShortcut } from "gpu.js";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
export const GAS_INTERACTION_DISTANCE = 5;

export const runSimulationStep = (
  particleMap: Float32Array,
  spatialGrid: SpatialGrid,
  worldSize: number,
  dt: number,
  kernel: IKernelRunShortcut
) => {
  // 20000 particles - 78ms
  // 20000 particles no gas constraint - 32ms
  // For 20000 particles tree creation alone is 24ms
  console.time("step");

  ParticleLens.forEachParticle((id) => {
    const x = ParticleLens.getPositionX(id, particleMap);
    const y = ParticleLens.getPositionY(id, particleMap);
    const z = ParticleLens.getPositionZ(id, particleMap);

    addParticle(spatialGrid, x, y, z, id);
  }, particleMap);

  applyConstraints(spatialGrid, particleMap, kernel, dt);

  ParticleLens.forEachParticle((id) => {
    applyAccelerationV2(id, particleMap, gravity, dt);

    applyVelocityV2(id, particleMap, dt);
  }, particleMap);

  resetGrid(spatialGrid);

  console.timeEnd("step");
};
