import SimplexNoise from "simplex-noise";
import { Grid3D } from "../data-structures/grid-3d";

export const populateGridWithFlatNoise = (
    grid: Grid3D,
    seed: string,
    smoothness: number,
    noiseStrengthReduction: number
  ) => {
    grid.resetBuffer();
    const simplex = new SimplexNoise(seed);
  
    for (let x = 0; x <= grid.width; x += 1) {
      for (let z = 0; z <= grid.depth; z += 1) {
        const value = Math.floor(
          (((simplex.noise2D(x / smoothness, z / smoothness) + 1) / 2) *
            grid.height) /
            noiseStrengthReduction
        );
        let position = value;
        console.log(value);
        while (position >= 0) {
          grid.setValue(x, position, z, "true");
          position -= 1;
        }
      }
    }
  };