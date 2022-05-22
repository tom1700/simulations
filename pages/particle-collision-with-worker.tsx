import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack, Slider } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as CANNON from "cannon";
import * as THREE from "three";
import { createBasicScene } from "../utils/create-basic-scene";
import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";
import { ParticleInfo } from "../workers/types";
import { Page } from "../components/Page";

const RADIUS = 1;

const updateMeshPosition = (mesh: THREE.Mesh, particle: ParticleInfo) => {
  mesh.position.x = particle.x;
  mesh.position.y = particle.y;
  mesh.position.z = particle.z;
  mesh.quaternion.x = particle.quaternionX;
  mesh.quaternion.y = particle.quaternionY;
  mesh.quaternion.z = particle.quaternionZ;
  mesh.quaternion.w = particle.quaternionW;
};

class Renderer3D {
  private shouldStop = false;
  private worldSize: number;
  private particlesAmount: number;
  private onFPSUpdate: (fps: number) => void;
  private isInitialized = false;
  private scene?: THREE.Scene;
  private idIndexMap: { [key: string]: number } = {};
  private sphereMeshes: THREE.Mesh[] = [];

  constructor(
    worldSize: number,
    particlesAmount: number,
    onFPSUpdate: (fps: number) => void
  ) {
    this.worldSize = worldSize;
    this.particlesAmount = particlesAmount;
    this.onFPSUpdate = onFPSUpdate;
  }

  private initializeMeshes(particles: ParticleInfo[]) {
    this.sphereMeshes = particles.map((particle, index) => {
      this.idIndexMap[particle.id] = index;

      const geometry = new THREE.SphereGeometry(RADIUS);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(particle.x, particle.y, particle.z);

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
        particle
      );
    });
  }

  startAnimation(canvasElement: HTMLDivElement) {
    const { scene, render, removeScene } = createBasicScene(
      canvasElement,
      this.worldSize
    );

    this.scene = scene;

    const animate = () => {
      if (this.shouldStop) {
        removeScene();
        return;
      }
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
      new URL("../workers/engine-worker.ts", import.meta.url)
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

    renderer3D.current = new Renderer3D(
      worldSize,
      particlesAmount,
      (fps: number) => {
        if (fpsCounterRef.current) {
          fpsCounterRef.current.innerText = fps.toFixed(0);
        }
      }
    );

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
      subtitle={`The same as before but this time I'm moving the physics engine to webworker to improve performance`}
      backLink="/particle-collision"
      backLabel="< Particle Collision"
    >
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
