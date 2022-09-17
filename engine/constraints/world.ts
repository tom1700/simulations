import { Particle } from "../interfaces/particle";
import { ParticleLens } from "../physics/particle-lens";

// Particles don't want to be too close to each other
export const worldConstraint = (particle: Particle, worldSize: number) => {
  const { position, velocity } = particle;
  if (
    (position.x < 0 && velocity.x < 0) ||
    (position.x > worldSize && velocity.x > 0)
  ) {
    velocity.x *= -0.9;
  }
  if (
    (position.y < 0 && velocity.y < 0) ||
    (position.y > worldSize && velocity.y > 0)
  ) {
    velocity.y *= -0.9;
  }
  if (
    (position.z < 0 && velocity.z < 0) ||
    (position.z > worldSize && velocity.z > 0)
  ) {
    velocity.z *= -0.9;
  }
};

export const worldConstraintV2 = (
  particleId: number,
  particleMap: Float32Array,
  worldSize: number
) => {
  const positionX = ParticleLens.getPositionX(particleId, particleMap);
  const positionY = ParticleLens.getPositionY(particleId, particleMap);
  const positionZ = ParticleLens.getPositionZ(particleId, particleMap);

  const velocityX = ParticleLens.getVelocityX(particleId, particleMap);
  const velocityY = ParticleLens.getVelocityY(particleId, particleMap);
  const velocityZ = ParticleLens.getVelocityZ(particleId, particleMap);

  if (
    (positionX < 0 && velocityX < 0) ||
    (positionX > worldSize && velocityX > 0)
  ) {
    ParticleLens.setVelocityX(particleId, particleMap, velocityX * -0.9);
  }
  if (
    (positionY < 0 && velocityY < 0) ||
    (positionY > worldSize && velocityY > 0)
  ) {
    ParticleLens.setVelocityY(particleId, particleMap, velocityY * -0.9);
  }
  if (
    (positionZ < 0 && velocityZ < 0) ||
    (positionZ > worldSize && velocityZ > 0)
  ) {
    ParticleLens.setVelocityZ(particleId, particleMap, velocityZ * -0.9);
  }
};
