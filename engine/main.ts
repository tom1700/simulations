import { Particle, ParticleType } from "./interfaces/particle";
import { ParticleLens } from "./physics/particle-lens";
import { buildGrid, getKernel } from "./physics/spatial-hashing";
import { GAS_INTERACTION_DISTANCE, runSimulationStep } from "./simulation";

export const runSimulation = (
  particleMap: Float32Array,
  worldSize: number,
  onUpdate: () => void
) => {
  let prevTime = Date.now();

  const grid = buildGrid(worldSize, 1);
  const kernel = getKernel(
    particleMap,
    grid,
    Math.ceil(GAS_INTERACTION_DISTANCE / grid.spacing),
    GAS_INTERACTION_DISTANCE,
    worldSize
  );

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(
      particleMap,
      grid,
      worldSize,
      (currentTime - prevTime) / 1000,
      kernel
    );
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  };

  step();
};
