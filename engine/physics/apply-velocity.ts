import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { addMutate, copyInto, multiplyByScalarMutate } from "../math/vector3";

const scaledVelocity: Vector3 = { x: 0, y: 0, z: 0 };

export const applyVelocity = (particle: Particle, time: number) => {
  copyInto(particle.velocity, scaledVelocity);
  multiplyByScalarMutate(scaledVelocity, time);
  addMutate(particle.position, scaledVelocity);
}
