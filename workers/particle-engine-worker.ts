import { WorkerIncomingMessage } from "./types";
import { runSimulation } from "../engine/main";
import { Particle } from "../engine/interfaces/particle";
import { getRandomValueWithinBounds } from "../engine/math/get-random-value-within-bounds";

class EngineWorker {
  private particles: Particle[] = [];
  private worldSize: number = 0;

  public initEngine(worldSize: number, particlesAmount: number) {
    this.worldSize = worldSize;
    this.particles = new Array(particlesAmount).fill(0).map((_, index) => {
      const particle: Particle = {
        id: index + 1,
        position: {
          x: getRandomValueWithinBounds(0, worldSize),
          y: getRandomValueWithinBounds(0, 1),
          z: getRandomValueWithinBounds(0, worldSize),
        },
        velocity: {
          x: getRandomValueWithinBounds(-2, 2),
          y: 0,
          z: getRandomValueWithinBounds(-2, 2),
        },
        mass: getRandomValueWithinBounds(1, 10),
      };

      return particle;
    });
  }

  start() {
    runSimulation(this.particles, this.worldSize, () => {
      postMessage(this.particles);
    });
  }
}

const engine = new EngineWorker();

addEventListener("message", (event) => {
  const data: WorkerIncomingMessage = event.data;

  if (data.type === "INITIALIZE") {
    const { worldSize, particlesAmount } = event.data;
    engine.initEngine(worldSize, particlesAmount);
  }
  if (data.type === "START") {
    engine.start();
  }
});
