import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { multiplicativeInverseFunction } from "../math/multiplicative-inverse-function";
import { copyInto, getDistance, getVectorBetweenPoints, multiplyByScalarMutate, normalizeMutate } from "../math/vector3";
import { applyAcceleration } from "../physics/apply-acceleration";

const directionVector: Vector3 = { x: 0, y: 0, z: 0 };
const accelerationVector: Vector3 = { x: 0, y: 0, z: 0 };

// Particles don't want to be too close to each other
export const gasConstraint = (particle1: Particle, particle2: Particle, repellingFactor = 1, time: number) => {
  const distance = getDistance(particle1.position, particle2.position);
  const repellingValue = Math.min(Math.max(0, multiplicativeInverseFunction(repellingFactor, -1, distance)), 100);

  getVectorBetweenPoints(particle1.position, particle2.position, directionVector);
  normalizeMutate(directionVector);

  copyInto(directionVector, accelerationVector);
  multiplyByScalarMutate(accelerationVector, repellingValue);

  applyAcceleration(particle2, accelerationVector, time)

  multiplyByScalarMutate(accelerationVector, -1);

  applyAcceleration(particle1, accelerationVector, time);
}
