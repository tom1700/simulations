import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { multiplicativeInverseFunction } from "../math/multiplicative-inverse-function";
import {
  copyInto,
  getDistance,
  getVectorBetweenPoints,
  multiplyByScalarMutate,
  normalizeMutate,
} from "../math/vector3";
import {
  applyAcceleration,
  applyAccelerationV2,
} from "../physics/apply-acceleration";
import { ParticleLens } from "../physics/particle-lens";

const directionVector: Vector3 = { x: 0, y: 0, z: 0 };
const accelerationVector: Vector3 = { x: 0, y: 0, z: 0 };
const particle1Position: Vector3 = { x: 0, y: 0, z: 0 };
const particle2Position: Vector3 = { x: 0, y: 0, z: 0 };
// Particles don't want to be too close to each other

export const gasConstraintSingleV2 = (
  particle1Id: number,
  particle2Id: number,
  particleMap: Float32Array,
  time: number
) => {
  particle1Position.x = ParticleLens.getPositionX(particle1Id, particleMap);
  particle1Position.y = ParticleLens.getPositionY(particle1Id, particleMap);
  particle1Position.z = ParticleLens.getPositionZ(particle1Id, particleMap);

  particle2Position.x = ParticleLens.getPositionX(particle2Id, particleMap);
  particle2Position.y = ParticleLens.getPositionY(particle2Id, particleMap);
  particle2Position.z = ParticleLens.getPositionZ(particle2Id, particleMap);

  const particle1Mass = ParticleLens.getMass(particle1Id, particleMap);
  const particle2Mass = ParticleLens.getMass(particle2Id, particleMap);
  const distance = getDistance(particle1Position, particle2Position);
  // Gives value between 1000 for distance=0 and 0 for distance=5
  const repellingValue = Math.max(0, 1000 * Math.exp(distance * -4.60517));

  const massRatio = particle2Mass / (particle2Mass + particle1Mass);

  getVectorBetweenPoints(particle1Position, particle2Position, directionVector);

  normalizeMutate(directionVector);

  copyInto(directionVector, accelerationVector);
  multiplyByScalarMutate(accelerationVector, -1 * repellingValue * massRatio);

  applyAccelerationV2(particle1Id, particleMap, accelerationVector, time);
};
