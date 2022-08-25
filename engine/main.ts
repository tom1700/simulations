import { Particle } from "./interfaces/particle";
import { OctreeNode } from "./math/octree";
import { runSimulationStep } from "./simulation";

export const runSimulation = (particles: Particle[], worldSize: number, onUpdate: () => void) => {
  let prevTime = Date.now();
  const particleMap = Object.fromEntries(particles.map((particle) => [particle.id, particle]));

  const nodes: OctreeNode[] = particles.map(particle => ({
    nodeId: particle.id,
    position: particle.position,
    children: {},
  }));

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(particleMap, nodes, worldSize, (currentTime - prevTime) / 1000);
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  }

  step();
}
