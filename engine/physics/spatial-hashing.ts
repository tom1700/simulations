import { Particle } from "../interfaces/particle";
import { ID } from "../interfaces/primitives";
import { Vector3 } from "../interfaces/vector3";
import { getDistance } from "../math/vector3";
import { ParticleLens } from "./particle-lens";

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

const forEachParticleInCellExceptTarget = (
  callback: (nodeId: number, neighbourId: number) => void,
  grid: SpatialGrid,
  headIndex: number,
  targetId: number
) => {
  const { cells, maxParticlesPerCell } = grid;

  for (let i = headIndex; i < headIndex + maxParticlesPerCell; i++) {
    if (!cells[i]) {
      return;
    }
    if (cells[i] !== targetId) {
      callback(cells[i], targetId);
    }
  }
};

const nodePosition = { x: 0, y: 0, z: 0 };
const neighbourPosition = { x: 0, y: 0, z: 0 };
export const forEachParticleNeighbourWithinRange = (
  callback: (
    nodeId: number,
    neighbourId: number,
    distanceBetween: number
  ) => void,
  grid: SpatialGrid,
  particleMap: Float32Array,
  distance: number
) => {
  const { cells, maxParticlesPerCell } = grid;
  const neighboursDepthToCheck = Math.ceil(distance / grid.spacing);

  const callIfInRange = (particleId: number, neighbourId: number) => {
    nodePosition.x = ParticleLens.getPositionX(particleId, particleMap);
    nodePosition.y = ParticleLens.getPositionY(particleId, particleMap);
    nodePosition.z = ParticleLens.getPositionZ(particleId, particleMap);

    neighbourPosition.x = ParticleLens.getPositionX(neighbourId, particleMap);
    neighbourPosition.y = ParticleLens.getPositionY(neighbourId, particleMap);
    neighbourPosition.z = ParticleLens.getPositionZ(neighbourId, particleMap);

    const distanceBetween = getDistance(nodePosition, neighbourPosition);

    if (distanceBetween <= distance) {
      callback(particleId, neighbourId, distanceBetween);
    }
  };

  for (let i = 0; i < cells.length; i += maxParticlesPerCell) {
    let index = i / maxParticlesPerCell;
    const x = Math.floor(index / (grid.size * grid.size));
    index -= x * grid.size * grid.size;
    const y = Math.floor(index / grid.size);
    const z = index % grid.size;

    for (let j = i; j < i + maxParticlesPerCell; j++) {
      if (!cells[j]) {
        break;
      }

      for (
        let nx = Math.max(x - neighboursDepthToCheck, 0);
        nx < Math.min(x + neighboursDepthToCheck, grid.size);
        nx++
      ) {
        for (
          let ny = Math.max(y - neighboursDepthToCheck, 0);
          ny < Math.min(y + neighboursDepthToCheck, grid.size);
          ny++
        ) {
          for (
            let nz = Math.max(z - neighboursDepthToCheck, 0);
            nz < Math.min(z + neighboursDepthToCheck, grid.size);
            nz++
          ) {
            const neighbourCellIndex =
              to1D(nx, ny, nz, grid.size, grid.size) * maxParticlesPerCell;
            forEachParticleInCellExceptTarget(
              callIfInRange,
              grid,
              neighbourCellIndex,
              cells[j]
            );
          }
        }
      }
    }
  }
};
