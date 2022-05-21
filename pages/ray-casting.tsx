import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack, Checkbox } from "@mui/material";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { CanvasDrawer } from "../utils/canvas-drawer";
import { EyeMonochrome } from "../actors/eye-monochrome";
import { Vector } from "../data-structures/vector3";
import { Direction, Grid3D } from "../data-structures/grid-3d";
import { castRays } from "../utils/cast-rays";

const initializeGrid = () => {
  const grid = new Grid3D(10, 10, 10);

  for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
      grid.setValue(x, 0, z, "ground");
    }
  }

  return grid;
};

const EYE_RESOLUTION = 300;

const RayCasting: NextPage = () => {
  const [raysAmount, setRaysAmount] = useState(1000);
  const canvas = useRef<HTMLCanvasElement>(null);

  const simulate = useCallback(() => {
    if (!canvas.current) return;
    const canvasDrawer = new CanvasDrawer(canvas.current);
    const grid = initializeGrid();

    const eye = new EyeMonochrome(
      EYE_RESOLUTION,
      new Vector(4, 1, 9),
      Direction.BACK
    );

    const lightPosition = new Vector(4, 4, 9);

    grid.setValue(eye.position.x, eye.position.y, eye.position.z, "eye");

    // FRONT WALL
    // grid.setValue(3, 1, 4, "ground");
    // grid.setValue(4, 1, 4, "ground");
    // grid.setValue(5, 1, 4, "ground");
    // grid.setValue(3, 2, 4, "ground");
    grid.setValue(4, 2, 7, "ground");
    // grid.setValue(5, 2, 4, "ground");
    // grid.setValue(3, 3, 4, "ground");
    // grid.setValue(4, 3, 4, "ground");
    // grid.setValue(5, 3, 4, "ground");

    grid.setValue(3, 1, 9, "ground");
    grid.setValue(5, 1, 9, "ground");

    castRays(grid, eye, lightPosition, raysAmount);

    canvasDrawer.drawBitmap(
      Uint32Array.from(eye.receptors.buffer),
      EYE_RESOLUTION
    );
  }, [raysAmount]);

  return (
    <Container
      maxWidth="lg"
      style={{
        minHeight: "100vh",
        paddingTop: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Head>
        <title>Simulations</title>
        <meta name="description" content=" Ray casting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3" component="h1">
        Ray casting
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/optimize-mesh"}>{"< Optimize Mesh"}</Link>
      </div>

      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <div style={{ flex: 2 }}>
          <canvas
            style={{ width: "100%", aspectRatio: "1 / 1" }}
            ref={canvas}
          ></canvas>
        </div>
        <Stack spacing={2} style={{ flex: 1 }}>
          Rays amount: {raysAmount}
          <Slider
            min={2}
            max={10000000}
            step={1}
            value={raysAmount}
            onChange={(_, value) => !Array.isArray(value) && setRaysAmount(value)}
          />
          <Button onClick={simulate}>Cast Rays</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default RayCasting;
