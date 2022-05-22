import type { NextPage } from "next";
import { Stack, Slider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createBasicScene } from "../utils/create-basic-scene";
import { ParticleInfo } from "../workers/types";
import { Page } from "../components/Page";
import throttle from "lodash/throttle";

const RADIUS = 1;

const updateMeshPosition = (
  mesh: THREE.Mesh,
  particle: ParticleInfo,
  worldSize: number
) => {
  mesh.position.x = particle.x - worldSize / 2;
  mesh.position.y = particle.y - worldSize / 2;
  mesh.position.z = particle.z - worldSize / 2;
  mesh.quaternion.x = particle.quaternionX;
  mesh.quaternion.y = particle.quaternionY;
  mesh.quaternion.z = particle.quaternionZ;
  mesh.quaternion.w = particle.quaternionW;
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

  private initializeMeshes(particles: ParticleInfo[]) {
    this.sphereMeshes = particles.map((particle, index) => {
      this.idIndexMap[particle.id] = index;

      const geometry = new THREE.SphereGeometry(RADIUS);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        particle.x - this.worldSize / 2,
        particle.y - this.worldSize / 2,
        particle.z - this.worldSize / 2
      );

      this.scene?.add(sphere);

      return sphere;
    });
  }

  update(particles: ParticleInfo[]) {
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

  stopAnimation() {
    this.shouldStop = true;
  }
}

const ParticleGravity: NextPage = () => {
  const renderer3D = useRef<Renderer3D>();
  const canvas = useRef<HTMLDivElement>(null);
  const fpsCounterRef = useRef<HTMLElement>(null);
  const [worldSize, setWorldSize] = useState(10);
  const [particlesAmount, setParticlesAmount] = useState(10);

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/engine-ammo-worker.ts", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startSimulation = useCallback(() => {
    if (!canvas.current || !workerRef.current) return;

    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
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
      title="Particle simulation with collisions and webworker"
      subtitle={`The same as before but this time I'm using ammo physics engine.`}
      backLink="/particle-collision-with-worker"
      backLabel="< Particle Collision with worker"
    >
      <Typography component={"p"}>
        Sorry for lack of live measurements, but it seems to be around 5 times
        faster then the previous version for 2k particles.
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
            max={2000}
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

export default ParticleGravity;
