import { gasConstraintSingle } from "../engine/constraints/gas";
import { Particle } from "../engine/interfaces/particle";
import { getDistance } from "../engine/math/vector3";

interface Message {
  particles: Particle[];
  neighbouringParticles: Particle[];
  distance: number;
  dt: number;
}

addEventListener("message", (event) => {
  const data: Message = event.data;
  const { particles, neighbouringParticles, dt, distance } = data;

  for (let i = 0; i < particles.length; i++) {
    const particle1 = particles[i];

    for (let j = 0; j < particles.length; j++) {
      if (j === i) continue;
      const particle2 = particles[j];
      const particlesDistance = getDistance(
        particle1.position,
        particle2.position
      );
      if (particlesDistance > distance) continue;
      gasConstraintSingle(particle1, particle2, distance + 1, dt);
    }

    for (let j = 0; j < neighbouringParticles.length; j++) {
      const particle2 = neighbouringParticles[j];
      const particlesDistance = getDistance(
        particle1.position,
        particle2.position
      );

      if (particlesDistance > distance) continue;
      gasConstraintSingle(particle1, particle2, distance + 1, dt);
    }
  }

  postMessage({
    particles,
  });
});
