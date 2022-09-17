export const ParticleLens = {
  length: 8,
  positionX: 0,
  positionY: 1,
  positionZ: 2,
  velocityX: 3,
  velocityY: 4,
  velocityZ: 5,
  mass: 6,
  type: 7,

  getIdForIndex(index: number) {
    return Math.floor(index / this.length);
  },

  getPositionX(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.positionX];
  },
  getPositionY(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.positionY];
  },
  getPositionZ(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.positionZ];
  },
  getVelocityX(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.velocityX];
  },
  getVelocityY(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.velocityY];
  },
  getVelocityZ(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.velocityZ];
  },
  getMass(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.mass];
  },
  getType(particleId: number, particleMap: Float32Array) {
    return particleMap[particleId * this.length + this.type];
  },

  setPositionX(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.positionX] = value;
  },
  setPositionY(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.positionY] = value;
  },
  setPositionZ(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.positionZ] = value;
  },
  setVelocityX(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.velocityX] = value;
  },
  setVelocityY(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.velocityY] = value;
  },
  setVelocityZ(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.velocityZ] = value;
  },
  setMass(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.mass] = value;
  },
  setType(particleId: number, particleMap: Float32Array, value: number) {
    particleMap[particleId * this.length + this.type] = value;
  },

  forEachParticle(
    callback: (particleId: number) => void,
    particleMap: Float32Array
  ) {
    for (
      let i = ParticleLens.length;
      i < particleMap.length;
      i += ParticleLens.length
    ) {
      const id = ParticleLens.getIdForIndex(i);

      callback(id);
    }
  },
};
