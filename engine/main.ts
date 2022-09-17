import { Particle } from "./interfaces/particle";
import { buildGrid } from "./physics/spatial-hashing";
import { runSimulationStep } from "./simulation";

export const runSimulation = (
  particles: Particle[],
  worldSize: number,
  onUpdate: () => void
) => {
  let prevTime = Date.now();
  const particleMap = Object.fromEntries(
    particles.map((particle) => [particle.id, particle])
  );

  const grid = buildGrid(worldSize, 10);

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(
      particleMap,
      particles,
      grid,
      worldSize,
      (currentTime - prevTime) / 1000
    );
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  };

  step();
};
