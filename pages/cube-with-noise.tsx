import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack } from "@mui/material";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid3D } from "../data-structures/grid-3d";
import Link from "next/link";
import Input from "@mui/material/Input";
import { populateGridWithFlatNoise } from "../noise/simplex";

function resolutionLabelFormat(value: number) {
  return value;
}

function calculateResolutionValue(value: number) {
  return 2 ** (value - 8);
}

class Renderer3D {
  private shouldStop = false;

  private initializeGrid(
    size: number,
    resolution: number,
    seed: string,
    smoothness: number,
    noiseStrengthReduction: number
  ) {
    const grid = new Grid3D(
      size / resolution,
      size / resolution,
      size / resolution
    );

    populateGridWithFlatNoise(grid, seed, smoothness, noiseStrengthReduction);

    return grid;
  }

  startAnimation(
    canvasElement: HTMLDivElement,
    size: number,
    resolution: number,
    seed: string,
    smoothness: number,
    noiseStrengthReduction: number
  ) {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    new OrbitControls(camera, canvasElement);

    camera.position.z = size * 3;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    canvasElement.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(resolution, resolution, resolution);
    const edges = new THREE.EdgesGeometry(geometry);

    const grid = this.initializeGrid(
      size,
      resolution,
      seed,
      smoothness,
      noiseStrengthReduction
    );

    grid.forEach((value, x, y, z) => {
      if (!value) return;
      const cubeLines = new THREE.LineSegments(edges, lineMaterial);
      cubeLines.position.x = x * resolution - size / 2;
      cubeLines.position.y = y * resolution;
      cubeLines.position.z = z * resolution - size / 2;
      scene.add(cubeLines);
    });

    const animate = () => {
      if (this.shouldStop) {
        canvasElement.removeChild(renderer.domElement);
        return;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }

  stopAnimation() {
    this.shouldStop = true;
  }
}

const CubeWithNoise: NextPage = () => {
  const [size, setSize] = useState(10);
  const [smoothness, setSmoothness] = useState(1);
  const [resolution, setResolution] = useState(8);
  const [noiseStrengthReduction, setNoiseStrengthReduction] = useState(1);
  const [seed, setSeed] = useState("John");
  const renderer3D = useRef<Renderer3D>();
  const canvas = useRef<HTMLDivElement>(null);

  const createCube = useCallback(() => {
    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
    }
    if (!canvas.current) return;
    renderer3D.current = new Renderer3D();
    renderer3D.current.startAnimation(
      canvas.current,
      size,
      calculateResolutionValue(resolution),
      seed,
      smoothness,
      noiseStrengthReduction
    );
  }, [noiseStrengthReduction, resolution, seed, size, smoothness]);

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
        <meta name="description" content="Cube based on noise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3" component="h1">
        Cube based on noise
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/naive-cube"}>{"< Naive Cube"}</Link>
        <Link href={"/optimize-mesh"}>{"Optimize Mesh >"}</Link>
      </div>

      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <div style={{ flex: 2 }} ref={canvas}></div>
        <Stack spacing={2} style={{ flex: 1 }}>
          Size: {size}
          <Slider
            min={1}
            max={100}
            step={1}
            value={size}
            onChange={(_, value) => !Array.isArray(value) && setSize(value)}
          />
          Resolution:{" "}
          {resolutionLabelFormat(calculateResolutionValue(resolution))}
          <Slider
            scale={calculateResolutionValue}
            value={resolution}
            min={1}
            step={1}
            max={8}
            valueLabelDisplay="auto"
            onChange={(_, value) =>
              !Array.isArray(value) && setResolution(value)
            }
          />
          Total Grid Size: <br />
          {Math.pow(size / calculateResolutionValue(resolution), 3)}
          Seed:{" "}
          <Input value={seed} onChange={(ev) => setSeed(ev.target.value)} />
          Smoothness:
          <Slider
            min={1}
            max={20}
            step={1}
            value={smoothness}
            onChange={(_, value) =>
              !Array.isArray(value) && setSmoothness(value)
            }
          />
          Noise strength reduction: {noiseStrengthReduction}
          <Slider
            min={1}
            max={5}
            step={0.25}
            value={noiseStrengthReduction}
            onChange={(_, value) =>
              !Array.isArray(value) && setNoiseStrengthReduction(value)
            }
          />
          <Button onClick={createCube}>Create</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default CubeWithNoise;
