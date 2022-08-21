import { Particle } from "./interfaces/particle";
import { runSimulationStep } from "./simulation";

export const runSimulation = (particles: Particle[], worldSize: number, onUpdate: () => void) => {
  let prevTime = Date.now();

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(particles, worldSize, (currentTime - prevTime) / 1000);
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  }

  step();
}
