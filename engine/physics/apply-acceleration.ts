import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { addMutate, copyInto, multiplyByScalarMutate } from "../math/vector3";

const scaledAcceleration: Vector3 = { x: 0, y: 0, z: 0 };

export const applyAcceleration = (particle: Particle, acceleration: Vector3, time: number) => {
  copyInto(acceleration, scaledAcceleration);
  multiplyByScalarMutate(scaledAcceleration, time);
  addMutate(particle.velocity, scaledAcceleration);
}
