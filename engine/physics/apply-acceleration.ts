import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { addMutate, copyInto, multiplyByScalarMutate } from "../math/vector3";
import { ParticleLens } from "./particle-lens";

const scaledAcceleration: Vector3 = { x: 0, y: 0, z: 0 };
const velocityVector: Vector3 = { x: 0, y: 0, z: 0 };

export const applyAcceleration = (
  particle: Particle,
  acceleration: Vector3,
  time: number
) => {
  copyInto(acceleration, scaledAcceleration);
  multiplyByScalarMutate(scaledAcceleration, time);
  addMutate(particle.velocity, scaledAcceleration);
};

export const applyAccelerationV2 = (
  particleId: number,
  particleMap: Float32Array,
  acceleration: Vector3,
  time: number
) => {
  velocityVector.x = ParticleLens.getVelocityX(particleId, particleMap);
  velocityVector.y = ParticleLens.getVelocityY(particleId, particleMap);
  velocityVector.z = ParticleLens.getVelocityZ(particleId, particleMap);

  copyInto(acceleration, scaledAcceleration);
  multiplyByScalarMutate(scaledAcceleration, time);

  addMutate(velocityVector, scaledAcceleration);

  ParticleLens.setVelocityX(particleId, particleMap, velocityVector.x);
  ParticleLens.setVelocityY(particleId, particleMap, velocityVector.y);
  ParticleLens.setVelocityZ(particleId, particleMap, velocityVector.z);
};
