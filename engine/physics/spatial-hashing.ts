import { ParticleLens } from "./particle-lens";
import { GPU, IKernelMapRunShortcut, IKernelRunShortcut, Input } from "gpu.js";

const gpu = new GPU();

export type SpatialGrid = {
  size: number;
  cells: Uint32Array;
  spacing: number;
  maxParticlesPerCell: number;
};

const to1D = (
  x: number,
  y: number,
  z: number,
  height: number,
  depth: number
) => {
  return (x * height + y) * depth + z;
};

const cordToIndex = (position: number, spacing: number) =>
  Math.floor(position / spacing);

const positionToGridIndex = (
  x: number,
  y: number,
  z: number,
  size: number,
  spacing: number,
  maxParticlesPerCell: number
) => {
  const gridX = cordToIndex(x, spacing);
  const gridY = cordToIndex(y, spacing);
  const gridZ = cordToIndex(z, spacing);

  return to1D(gridX, gridY, gridZ, size, size) * maxParticlesPerCell;
};

export const buildGrid = (worldSize: number, spacing: number): SpatialGrid => {
  const size = Math.ceil(worldSize / spacing);
  // For spacing = 1 => 5, For spacing = 10 => 5000
  const maxParticlesPerCell = Math.pow(spacing, 3) * 5;

  const cells: Uint32Array = new Uint32Array(
    size * size * size * maxParticlesPerCell
  );

  return {
    size,
    cells,
    spacing,
    maxParticlesPerCell,
  };
};

export const addParticle = (
  grid: SpatialGrid,
  particleX: number,
  particleY: number,
  particleZ: number,
  particleId: number
) => {
  const { size, cells, spacing, maxParticlesPerCell } = grid;

  const index = positionToGridIndex(
    particleX,
    particleY,
    particleZ,
    size,
    spacing,
    maxParticlesPerCell
  );

  // Rouge particle
  if (index > grid.cells.length - 1 || index < 0) return;

  for (let i = index; i < index + maxParticlesPerCell; i++) {
    if (!cells[i]) {
      cells[i] = particleId;
      return;
    }
  }
};

export const resetGrid = (grid: SpatialGrid) => {
  grid.cells.fill(0);
};

export const getKernel = (
  particleMap: Float32Array,
  grid: SpatialGrid,
  neighboursDepthToCheck: number,
  interactionDistance: number,
  worldSize: number
) => {
  function from3to1D(
    x: number,
    y: number,
    z: number,
    height: number,
    depth: number
  ) {
    return (x * height + y) * depth + z;
  }

  function positionToGridIndex(
    x: number,
    y: number,
    z: number,
    size: number,
    spacing: number,
    maxParticlesPerCell: number
  ) {
    const gridX = Math.floor(x / spacing);
    const gridY = Math.floor(y / spacing);
    const gridZ = Math.floor(z / spacing);

    return from3to1D(gridX, gridY, gridZ, size, size) * maxParticlesPerCell;
  }

  function getDistance(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ) {
    return Math.sqrt(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
    );
  }

  function applyWorldConstraint(
    position: [number, number, number],
    velocity: [number, number, number],
    worldSize: number
  ) {
    if (
      (position[0] < 0 && velocity[0] < 0) ||
      (position[0] > worldSize && velocity[0] > 0)
    ) {
      velocity[0] *= -0.9;
    }
    if (
      (position[1] < 0 && velocity[1] < 0) ||
      (position[1] > worldSize && velocity[1] > 0)
    ) {
      velocity[1] *= -0.9;
    }
    if (
      (position[2] < 0 && velocity[2] < 0) ||
      (position[2] > worldSize && velocity[2] > 0)
    ) {
      velocity[2] *= -0.9;
    }

    return velocity;
  }

  function applyAcceleration(
    velocity: [number, number, number],
    acceleration: [number, number, number],
    dt: number
  ): [number, number, number] {
    return [
      velocity[0] + acceleration[0] * dt,
      velocity[1] + acceleration[1] * dt,
      velocity[2] + acceleration[2] * dt,
    ];
  }

  function applyVelocity(
    position: [number, number, number],
    velocity: [number, number, number],
    dt: number
  ): [number, number, number] {
    return [
      position[0] + velocity[0] * dt,
      position[1] + velocity[1] * dt,
      position[2] + velocity[2] * dt,
    ];
  }

  gpu.addFunction(from3to1D);
  gpu.addFunction(positionToGridIndex);
  gpu.addFunction(getDistance);
  gpu.addFunction(applyWorldConstraint);
  gpu.addFunction(applyAcceleration);
  gpu.addFunction(applyVelocity);

  const kernel = gpu
    .createKernelMap(
      [applyWorldConstraint],
      function (particleMap: number[], hashGrid: number[], dt: number) {
        if (this.thread.x === 0) return [0.0, 0.0, 0.0];

        const particleId = this.thread.x;
        const particleRowLength = this.constants.particleRowLength as number;
        const velocityXIndex = this.constants.velocityXIndex as number;
        const velocityYIndex = this.constants.velocityYIndex as number;
        const velocityZIndex = this.constants.velocityZIndex as number;
        const positionXIndex = this.constants.positionXIndex as number;
        const positionYIndex = this.constants.positionYIndex as number;
        const positionZIndex = this.constants.positionZIndex as number;
        const massIndex = this.constants.massIndex as number;
        const particleTypeIndex = this.constants.particleTypeIndex as number;
        const gridSize = this.constants.gridSize as number;
        const gridSpacing = this.constants.gridSpacing as number;
        const gridMaxParticlesPerCell = this.constants
          .gridMaxParticlesPerCell as number;
        const neighboursDepthToCheck = this.constants
          .neighboursDepthToCheck as number;
        const interactionDistance = this.constants
          .interactionDistance as number;
        const worldSize = this.constants.worldSize as number;

        const rowStartIndex = this.thread.x * particleRowLength;

        const position: [number, number, number] = [
          particleMap[rowStartIndex + positionXIndex],
          particleMap[rowStartIndex + positionYIndex],
          particleMap[rowStartIndex + positionZIndex],
        ];
        let velocityX = particleMap[rowStartIndex + velocityXIndex];
        let velocityY = particleMap[rowStartIndex + velocityYIndex];
        let velocityZ = particleMap[rowStartIndex + velocityZIndex];
        const mass = particleMap[rowStartIndex + massIndex];
        const particleType = particleMap[rowStartIndex + particleTypeIndex];

        const gridCellStartIndex = positionToGridIndex(
          position[0],
          position[1],
          position[2],
          gridSize,
          gridSpacing,
          gridMaxParticlesPerCell
        );

        let index = gridCellStartIndex / gridMaxParticlesPerCell;
        const x = Math.floor(index / (gridSize * gridSize));
        index -= x * gridSize * gridSize;
        const y = Math.floor(index / gridSize);
        const z = index % gridSize;

        for (
          let nx = Math.max(x - neighboursDepthToCheck, 0);
          nx < Math.min(x + neighboursDepthToCheck, gridSize);
          nx++
        ) {
          for (
            let ny = Math.max(y - neighboursDepthToCheck, 0);
            ny < Math.min(y + neighboursDepthToCheck, gridSize);
            ny++
          ) {
            for (
              let nz = Math.max(z - neighboursDepthToCheck, 0);
              nz < Math.min(z + neighboursDepthToCheck, gridSize);
              nz++
            ) {
              const cellIndex =
                from3to1D(nx, ny, nz, gridSize, gridSize) *
                gridMaxParticlesPerCell;

              for (
                let i = cellIndex;
                i < cellIndex + gridMaxParticlesPerCell;
                i++
              ) {
                const neighbourId = hashGrid[i];
                if (neighbourId === 0 || neighbourId === particleId) {
                  break;
                }

                const neighbourRowStartIndex = neighbourId * particleRowLength;

                const neighbourPositionX =
                  particleMap[neighbourRowStartIndex + positionXIndex];
                const neighbourPositionY =
                  particleMap[neighbourRowStartIndex + positionYIndex];
                const neighbourPositionZ =
                  particleMap[neighbourRowStartIndex + positionZIndex];
                const neighbourMass =
                  particleMap[neighbourRowStartIndex + massIndex];

                const distance = getDistance(
                  neighbourPositionX,
                  neighbourPositionY,
                  neighbourPositionZ,
                  position[0],
                  position[1],
                  position[2]
                );

                if (distance <= interactionDistance) {
                  let repellingValue = 0;

                  if (particleType === 0) {
                    // GAS CONSTRAINT
                    // Gives value between 1000 for distance=0 and 0 for distance=5
                    repellingValue = Math.max(
                      0,
                      1000 * Math.exp(distance * -4.60517)
                    );
                  } else {
                    // LIQUID CONSTRAINT
                    if (distance >= 0 && distance < 4) {
                      repellingValue = 10 - 5 * distance;
                    }
                  }

                  const massRatio = neighbourMass / (neighbourMass + mass);

                  const accelerationStrength =
                    -1 * repellingValue * massRatio * dt;
                  const accelerationX =
                    ((neighbourPositionX - position[0]) / distance) *
                    accelerationStrength;
                  const accelerationY =
                    ((neighbourPositionY - position[1]) / distance) *
                    accelerationStrength;
                  const accelerationZ =
                    ((neighbourPositionZ - position[2]) / distance) *
                    accelerationStrength;
                  velocityX += accelerationX;
                  velocityY += accelerationY;
                  velocityZ += accelerationZ;
                }
              }
            }
          }
        }

        return applyVelocity(
          position,
          applyWorldConstraint(
            position,
            applyAcceleration(
              [velocityX, velocityY, velocityZ],
              [0, -9.8, 0],
              dt
            ),
            worldSize
          ),
          dt
        );
      }
    )
    .setOutput([ParticleLens.getCount(particleMap)])
    .setConstants({
      particleRowLength: ParticleLens.length,
      velocityXIndex: ParticleLens.velocityX,
      velocityYIndex: ParticleLens.velocityY,
      velocityZIndex: ParticleLens.velocityZ,
      positionXIndex: ParticleLens.positionX,
      positionYIndex: ParticleLens.positionY,
      positionZIndex: ParticleLens.positionZ,
      particleTypeIndex: ParticleLens.type,
      massIndex: ParticleLens.mass,
      gridSize: grid.size,
      gridSpacing: grid.spacing,
      gridMaxParticlesPerCell: grid.maxParticlesPerCell,
      neighboursDepthToCheck,
      interactionDistance,
      worldSize,
    });

  return kernel;
};

export const updateParticles = (
  grid: SpatialGrid,
  particleMap: Float32Array,
  kernel: IKernelMapRunShortcut<any>,
  dt: number
) => {
  const { 0: velocities, result: positions } = kernel(
    particleMap,
    grid.cells,
    dt
  );

  ParticleLens.forEachParticle((particleId) => {
    ParticleLens.setPositionX(
      particleId,
      particleMap,
      positions[particleId][0]
    );
    ParticleLens.setPositionY(
      particleId,
      particleMap,
      positions[particleId][1]
    );
    ParticleLens.setPositionZ(
      particleId,
      particleMap,
      positions[particleId][2]
    );

    ParticleLens.setVelocityX(
      particleId,
      particleMap,
      velocities[particleId][0]
    );
    ParticleLens.setVelocityY(
      particleId,
      particleMap,
      velocities[particleId][1]
    );
    ParticleLens.setVelocityZ(
      particleId,
      particleMap,
      velocities[particleId][2]
    );
  }, particleMap);
};
