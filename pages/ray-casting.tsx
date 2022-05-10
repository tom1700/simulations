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
import { Direction } from "../data-structures/grid-3d";

const RayCasting: NextPage = () => {
  const [size, setSize] = useState(10);
  const canvas = useRef<HTMLCanvasElement>(null);

  const castRays = useCallback(() => {
    if (!canvas.current) return;
    const canvasDrawer = new CanvasDrawer(canvas.current);

    const eyeMonochrome = new EyeMonochrome(100, new Vector(5, 1, 0), Direction.BACK);
    for(let i = 0; i<1000;i++) {
      eyeMonochrome.updateByRay();
    }
    
    canvasDrawer.drawBitmap(Uint32Array.from(eyeMonochrome.receptors.buffer), 100);
  }, []);

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
          Rays amount: {size}
          <Slider
            min={1}
            max={100}
            step={1}
            value={size}
            onChange={(_, value) => !Array.isArray(value) && setSize(value)}
          />
          <Button onClick={castRays}>Cast Rays</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default RayCasting;
