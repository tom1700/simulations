import { gasConstraint } from "./constraints/gas";
import { worldConstraint } from "./constraints/world";
import { Particle } from "./interfaces/particle";
import { Vector3 } from "./interfaces/vector3";
import { applyAcceleration } from "./physics/apply-acceleration";
import { applyVelocity } from "./physics/apply-velocity";

const gravity: Vector3 = { x: 0, y: -9.8, z: 0 };

export const runSimulationStep = (particles: Particle[], worldSize: number, dt: number) => {
  for (let i = 0; i < particles.length; i++) {
    const particle1 = particles[i];
    applyAcceleration(particle1, gravity, dt)

    for (let j = i + 1; j < particles.length; j++) {
      const particle2 = particles[j];

      gasConstraint(particle1, particle2, 11, dt);
    }

    worldConstraint(particle1, worldSize);

    applyVelocity(particle1, dt);
  }
}
