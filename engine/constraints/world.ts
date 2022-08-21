import { Particle } from "../interfaces/particle";

// Particles don't want to be too close to each other
export const worldConstraint = (particle: Particle, worldSize: number) => {
  const { position, velocity } = particle;
  if (position.x < 0 && velocity.x < 0 || position.x > worldSize && velocity.x > 0) {
    velocity.x *= -0.9;
  }
  if (position.y < 0 && velocity.y < 0 || position.y > worldSize && velocity.y > 0) {
    velocity.y *= -0.9;
  }
  if (position.z < 0 && velocity.z < 0 || position.z > worldSize && velocity.z > 0) {
    velocity.z *= -0.9;
  }
}
