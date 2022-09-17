import { Particle } from "../interfaces/particle";
import { Vector3 } from "../interfaces/vector3";
import { addMutate, copyInto, multiplyByScalarMutate } from "../math/vector3";
import { ParticleLens } from "./particle-lens";

const scaledVelocity: Vector3 = { x: 0, y: 0, z: 0 };
const velocityVector: Vector3 = { x: 0, y: 0, z: 0 };
const positionVector: Vector3 = { x: 0, y: 0, z: 0 };

export const applyVelocity = (particle: Particle, time: number) => {
  copyInto(particle.velocity, scaledVelocity);
  multiplyByScalarMutate(scaledVelocity, time);
  addMutate(particle.position, scaledVelocity);
};

export const applyVelocityV2 = (
  particleId: number,
  particleMap: Float32Array,
  time: number
) => {
  velocityVector.x = ParticleLens.getVelocityX(particleId, particleMap);
  velocityVector.y = ParticleLens.getVelocityY(particleId, particleMap);
  velocityVector.z = ParticleLens.getVelocityZ(particleId, particleMap);

  positionVector.x = ParticleLens.getPositionX(particleId, particleMap);
  positionVector.y = ParticleLens.getPositionY(particleId, particleMap);
  positionVector.z = ParticleLens.getPositionZ(particleId, particleMap);

  multiplyByScalarMutate(velocityVector, time);
  addMutate(positionVector, velocityVector);

  ParticleLens.setPositionX(particleId, particleMap, positionVector.x);
  ParticleLens.setPositionY(particleId, particleMap, positionVector.y);
  ParticleLens.setPositionZ(particleId, particleMap, positionVector.z);
};
