import { Particle } from "./interfaces/particle";
import { OctreeNode } from "./math/octree";
import { buildGrid, LinkedListNode } from "./math/spatial-hashing";
import { runSimulationStep } from "./simulation";
import { WorkersScheduler } from "./workers-scheduler";

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
    position: particle.position,
    next: null,
  }));

  const grid = buildGrid(worldSize, 10);

  const workScheduler = new WorkersScheduler([
    new Worker(new URL("../workers/gas-constraint-worker.ts", import.meta.url)),
    new Worker(new URL("../workers/gas-constraint-worker.ts", import.meta.url)),
    new Worker(new URL("../workers/gas-constraint-worker.ts", import.meta.url)),
    new Worker(new URL("../workers/gas-constraint-worker.ts", import.meta.url)),
  ]);

  const step = async () => {
    const currentTime = Date.now();

    await runSimulationStep(
      particleMap,
      nodes,
      grid,
      worldSize,
      (currentTime - prevTime) / 1000,
      workScheduler
    );
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  };

  step();
};
