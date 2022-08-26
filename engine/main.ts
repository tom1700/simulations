import { Particle } from "./interfaces/particle";
import { OctreeNode } from "./math/octree";
import { buildGrid, LinkedListNode } from "./math/spatial-hashing";
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

  const nodes: LinkedListNode[] = particles.map((particle) => ({
    nodeId: particle.id,
    next: null,
  }));

  const grid = buildGrid(worldSize, 10);

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(
      particleMap,
      nodes,
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
