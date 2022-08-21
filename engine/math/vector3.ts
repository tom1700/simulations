import { Vector3 } from "../interfaces/vector3";

export const copyInto = (source: Vector3, target: Vector3) => {
  target.x = source.x;
  target.y = source.y;
  target.z = source.z;
}

export const addMutate = (vector1: Vector3, vector2: Vector3) => {
  vector1.x += vector2.x;
  vector1.y += vector2.y;
  vector1.z += vector2.z;
}

export const multiplyByScalarMutate = (vector1: Vector3, scalar: number) => {
  vector1.x *= scalar;
  vector1.y *= scalar;
  vector1.z *= scalar;
}

export const getDistance = (vector1: Vector3, vector2: Vector3) =>
  Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2));

export const getLength = (vector: Vector3) => Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));

export const getVectorBetweenPoints = (point1: Vector3, point2: Vector3, targetVector: Vector3) => {
  targetVector.x = point2.x - point1.x;
  targetVector.y = point2.y - point1.y;
  targetVector.z = point2.z - point1.z;
}

export const normalizeMutate = (vector: Vector3) => {
  const length = getLength(vector);
  vector.x = vector.x / length;
  vector.y = vector.y / length;
  vector.z = vector.z / length;
}

