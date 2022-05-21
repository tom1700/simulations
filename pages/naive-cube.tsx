import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack } from "@mui/material";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Link from "next/link";

function resolutionLabelFormat(value: number) {
  return value;
}

function calculateResolutionValue(value: number) {
  return 2 ** (value - 8);
}

class Renderer3D {
  private shouldStop = false;

  startAnimation(
    canvasElement: HTMLDivElement,
    size: number,
    resolution: number
  ) {
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
    new OrbitControls(camera, canvasElement);

    camera.position.z = size * 3;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    canvasElement.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(resolution, resolution, resolution);
    const edges = new THREE.EdgesGeometry(geometry);

    for (let x = 0; x < size / resolution; x += 1) {
      for (let y = 0; y < size / resolution; y += 1) {
        for (let z = 0; z < size / resolution; z += 1) {
          const cubeLines = new THREE.LineSegments(edges, lineMaterial);
          cubeLines.position.x = x * resolution - size / 2;
          cubeLines.position.y = y * resolution - size / 2;
          cubeLines.position.z = z * resolution - size / 2;
          scene.add(cubeLines);
        }
      }
    }

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

const NaiveCube: NextPage = () => {
  const [size, setSize] = useState(10);
  const [resolution, setResolution] = useState(8);
  const renderer3D = useRef<Renderer3D>();
  const canvas = useRef<HTMLDivElement>(null);

  const startSimulation = useCallback(() => {
    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
    }
    if (!canvas.current) return;
    renderer3D.current = new Renderer3D();
    renderer3D.current.startAnimation(
      canvas.current,
      size,
      calculateResolutionValue(resolution)
    );
  }, [resolution, size]);

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
        <meta name="description" content="Dynamic Cube Naive implementation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3" component="h1">
        Dynamic Cube Naive implementation
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/"}>{"< Home"}</Link>
        <Link href={"/cube-with-noise"}>{"Cube With Noise >"}</Link>
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
          <Button onClick={startSimulation}>Create</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default NaiveCube;
