import { WorkerIncomingMessage } from "./types";
import { runSimulation } from "../engine/main";
import { Particle, ParticleType } from "../engine/interfaces/particle";
import { getRandomValueWithinBounds } from "../engine/math/get-random-value-within-bounds";
import { ParticleLens } from "../engine/physics/particle-lens";

class EngineWorker {
  private particleMap: Float32Array = new Float32Array();
  private worldSize: number = 0;

  public initEngine(worldSize: number, particlesAmount: number) {
    this.worldSize = worldSize;
    this.particleMap = new Float32Array(
      (particlesAmount + 1) * ParticleLens.length
    );

    ParticleLens.forEachParticle((particleId) => {
      ParticleLens.setVelocityX(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(-2, 2)
      );
      ParticleLens.setVelocityY(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(-2, 2)
      );
      ParticleLens.setVelocityZ(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(-2, 2)
      );

      ParticleLens.setPositionX(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(0, worldSize)
      );
      ParticleLens.setPositionY(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(0, worldSize)
      );
      ParticleLens.setPositionZ(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(0, worldSize)
      );

      ParticleLens.setMass(
        particleId,
        this.particleMap,
        getRandomValueWithinBounds(1, 10)
      );
      ParticleLens.setType(particleId, this.particleMap, ParticleType.gas);
    }, this.particleMap);
  }

  start() {
    runSimulation(this.particleMap, this.worldSize, () => {
      postMessage(this.particleMap);
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
