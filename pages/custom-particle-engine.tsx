import type { NextPage } from "next";
import { Stack, Slider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createBasicScene } from "../utils/create-basic-scene";
import { Page } from "../components/Page";
import throttle from "lodash/throttle";
import { Particle } from "../engine/interfaces/particle";

const RADIUS = 0.5;

const updateMeshPosition = (
  mesh: THREE.Mesh,
  particle: Particle,
  worldSize: number
) => {
  mesh.position.x = particle.position.x - worldSize / 2;
  mesh.position.y = particle.position.y - worldSize / 2;
  mesh.position.z = particle.position.z - worldSize / 2;
};

class Renderer3D {
  private shouldStop = false;
  private worldSize: number;
  private onFPSUpdate: (fps: number) => void;
  private isInitialized = false;
  private scene?: THREE.Scene;
  private idIndexMap: { [key: string]: number } = {};
  private sphereMeshes: THREE.Mesh[] = [];

  constructor(worldSize: number, onFPSUpdate: (fps: number) => void) {
    this.worldSize = worldSize;
    this.onFPSUpdate = onFPSUpdate;
  }

  private initializeMeshes(particles: Particle[]) {
    this.sphereMeshes = particles.map((particle, index) => {
      this.idIndexMap[particle.id] = index;

      const geometry = new THREE.SphereGeometry(RADIUS, 8, 6);
      const material = new THREE.MeshBasicMaterial({
        color: `rgb(${Math.max(Math.floor(255 / particle.mass), 0)}, 0, 0)`,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        particle.position.x - this.worldSize / 2,
        particle.position.y - this.worldSize / 2,
        particle.position.z - this.worldSize / 2
      );

      this.scene?.add(sphere);

      return sphere;
    });
  }

  update(particles: Particle[]) {
    if (!this.isInitialized) {
      this.initializeMeshes(particles);
      this.isInitialized = true;
      return;
    }

    particles.forEach((particle) => {
      updateMeshPosition(
        this.sphereMeshes[this.idIndexMap[particle.id]],
        particle,
        this.worldSize
      );
    });
  }

  startAnimation(canvasElement: HTMLDivElement) {
    const { scene, render, removeScene } = createBasicScene(
      canvasElement,
      this.worldSize
    );

    this.scene = scene;
    let prevTime = Date.now();
    const animate = () => {
      if (this.shouldStop) {
        removeScene();
        return;
      }
      const currentTime = Date.now();
      this.onFPSUpdate(1000 / (currentTime - prevTime));
      prevTime = currentTime;
      requestAnimationFrame(animate);
      render();
    };

    animate();
  }
}

const CustomParticleEngine: NextPage = () => {
  const renderer3D = useRef<Renderer3D>();
  const canvas = useRef<HTMLDivElement>(null);
  const fpsCounterRef = useRef<HTMLElement>(null);
  const [worldSize, setWorldSize] = useState(100);
  const [particlesAmount, setParticlesAmount] = useState(1000);

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/particle-engine-worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startSimulation = useCallback(() => {
    if (!canvas.current || !workerRef.current) return;

    if (renderer3D.current) {
      workerRef.current.postMessage({ type: "STOP" });
    }

    const updateFps = (fps: number) => {
      if (fpsCounterRef.current) {
        fpsCounterRef.current.innerText = fps.toFixed(0);
      }
    };

    renderer3D.current = new Renderer3D(worldSize, throttle(updateFps, 1000));

    renderer3D.current.startAnimation(canvas.current);

    workerRef.current.onmessage = (evt) => {
      renderer3D.current?.update(evt.data);
    };

    workerRef.current?.postMessage({
      type: "INITIALIZE",
      worldSize,
      particlesAmount,
    });

    workerRef.current?.postMessage({ type: "START" });
  }, [particlesAmount, worldSize]);

  return (
    <Page
      title="Particle simulation with custom engine"
      subtitle={``}
      backLink="/particle-collision-with-worker-ammo"
      backLabel="< Particle Collision with worker and ammo engine"
    >
      <Typography component={"p"}>
        A custom particle engine. In this case it is supposed to be the gas
        particles simulation. On one hand the gravity is pulling them downward.
        On the other hand they are repelling each other.
      </Typography>
      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <div style={{ flex: 2 }} ref={canvas}></div>
        <Stack spacing={2} style={{ flex: 1 }}>
          World Size: {worldSize}
          <Slider
            min={10}
            max={100}
            step={1}
            value={worldSize}
            onChange={(_, value) =>
              !Array.isArray(value) && setWorldSize(value)
            }
          />
          Particles Amount: {particlesAmount}
          <Slider
            min={10}
            max={20000}
            step={1}
            value={particlesAmount}
            onChange={(_, value) =>
              !Array.isArray(value) && setParticlesAmount(value)
            }
          />
          <div>
            FPS: <span ref={fpsCounterRef}>0</span>
          </div>
          <Button onClick={startSimulation}>Simulate</Button>
        </Stack>
      </Stack>
    </Page>
  );
};

export default CustomParticleEngine;
