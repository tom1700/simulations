import { ID } from "./primitives";
import { Vector3 } from "./vector3";

export interface Particle {
  id: ID;
  position: Vector3;
  velocity: Vector3;
  mass: number;
}

export enum ParticleType {
  gas,
  liquid,
  solid,
}
