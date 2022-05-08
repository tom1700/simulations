import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack, Checkbox } from "@mui/material";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Grid3D } from "../data-structures/grid-3d";
import Link from "next/link";
import Input from "@mui/material/Input";
import { populateGridWithFlatNoise } from "../noise/simplex";
import { grid3DToGeometry } from "../utils/grid-3d-to-geometry";

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
    noiseStrengthReduction: number,
    withMesh: boolean
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

    const grid = this.initializeGrid(
      size,
      resolution,
      seed,
      smoothness,
      noiseStrengthReduction
    );

    const geometry = grid3DToGeometry(grid, resolution);

    if (!withMesh) {
      const edges = new THREE.EdgesGeometry(geometry);
      const lines = new THREE.LineSegments(edges, lineMaterial);
      lines.position.x = -size / 2;
      lines.position.z = -size / 2;
      scene.add(lines);
    } else {
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = -size / 2;
      mesh.position.z = -size / 2;
      scene.add(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;

    scene.add(light);

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
  const [withMesh, setWithMesh] = useState(false);
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
      noiseStrengthReduction,
      withMesh
    );
  }, [noiseStrengthReduction, resolution, seed, size, smoothness, withMesh]);

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
        <meta
          name="description"
          content="Cube based on noise with optimized mesh"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3" component="h1">
        Cube based on noise with optimized mesh
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/optimize-mesh"}>{"< Optimize Mesh"}</Link>
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
          Total Grid Size:{" "}
          {Math.pow(size / calculateResolutionValue(resolution), 3)}
          <br />
          Seed
          <Input value={seed} onChange={(ev) => setSeed(ev.target.value)} />
          Smoothness:{" "}{smoothness}
          <Slider
            min={1}
            max={40}
            step={1}
            value={smoothness}
            onChange={(_, value) =>
              !Array.isArray(value) && setSmoothness(value)
            }
          />
          Noise strength reduction: {noiseStrengthReduction}
          <Slider
            min={1}
            max={10}
            step={0.25}
            value={noiseStrengthReduction}
            onChange={(_, value) =>
              !Array.isArray(value) && setNoiseStrengthReduction(value)
            }
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            Show mesh
            <Checkbox
              value={withMesh}
              onChange={(_, checked) => {
                setWithMesh(checked);
              }}
            ></Checkbox>
          </div>
          <Button onClick={createCube}>Create</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default CubeWithNoise;
