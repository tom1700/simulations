import { worldConstraintV2 } from "./constraints/world";
import { Vector3 } from "./interfaces/vector3";
import {
  addParticle,
  resetGrid,
  SpatialGrid,
  updateParticles,
} from "./physics/spatial-hashing";
import { ParticleLens } from "./physics/particle-lens";
import { IKernelMapRunShortcut } from "gpu.js";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };
export const GAS_INTERACTION_DISTANCE = 5;

export const runSimulationStep = (
  particleMap: Float32Array,
  spatialGrid: SpatialGrid,
  worldSize: number,
  dt: number,
  kernel: IKernelMapRunShortcut<any>
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

  updateParticles(spatialGrid, particleMap, kernel, dt);

  resetGrid(spatialGrid);

  console.timeEnd("step");
};
