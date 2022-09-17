import { Particle, ParticleType } from "./interfaces/particle";
import { ParticleLens } from "./physics/particle-lens";
import { buildGrid } from "./physics/spatial-hashing";
import { runSimulationStep } from "./simulation";

export const runSimulation = (
  particles: Particle[],
  worldSize: number,
  onUpdate: () => void
) => {
  let prevTime = Date.now();
  const particleMap = new Float32Array(
    (particles.length + 1) * ParticleLens.length
  );

  particles.forEach((particle) => {
    ParticleLens.setVelocityX(particle.id, particleMap, particle.velocity.x);
    ParticleLens.setVelocityY(particle.id, particleMap, particle.velocity.y);
    ParticleLens.setVelocityZ(particle.id, particleMap, particle.velocity.z);

    ParticleLens.setPositionX(particle.id, particleMap, particle.position.x);
    ParticleLens.setPositionY(particle.id, particleMap, particle.position.y);
    ParticleLens.setPositionZ(particle.id, particleMap, particle.position.z);

    ParticleLens.setMass(particle.id, particleMap, particle.mass);
    ParticleLens.setType(particle.id, particleMap, ParticleType.gas);
  });

  const grid = buildGrid(worldSize, 1);

  const step = () => {
    const currentTime = Date.now();

    runSimulationStep(
      particleMap,
      grid,
      worldSize,
      (currentTime - prevTime) / 1000
    );
    particles.forEach((particle) => {
      particle.velocity.x = ParticleLens.getVelocityX(particle.id, particleMap);
      particle.velocity.y = ParticleLens.getVelocityY(particle.id, particleMap);
      particle.velocity.z = ParticleLens.getVelocityZ(particle.id, particleMap);

      particle.position.x = ParticleLens.getPositionX(particle.id, particleMap);
      particle.position.y = ParticleLens.getPositionY(particle.id, particleMap);
      particle.position.z = ParticleLens.getPositionZ(particle.id, particleMap);
    });
    onUpdate();
    prevTime = currentTime;
    requestAnimationFrame(step);
  };

  step();
};
