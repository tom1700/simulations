import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useRef } from "react";
import Link from "next/link";
import { createBasicScene } from "../utils/create-basic-scene";
import { Vector } from "../data-structures/vector3";
import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";
import { Particle } from "../actors/particle";
import { MotionSim } from "../utils/motion-sim";
import * as THREE from "three";

const FRAME_TIME = 1000 / 60;

class Renderer3D {
  private shouldStop = false;

  startAnimation(canvasElement: HTMLDivElement) {
    const { scene, render, removeScene } = createBasicScene(canvasElement, 10);
    const particles = new Array(10).fill(0).map(() => {
      const position = new Vector(
        getRandomValueWithinBounds(0, 10),
        getRandomValueWithinBounds(0, 10),
        getRandomValueWithinBounds(0, 10)
      );
      return new Particle(position, 0.5);
    });

    const motionSim = new MotionSim(particles, 10);

    const sphereParticlePairs = particles.map((particle) => {
      const geometry = new THREE.SphereGeometry(particle.radius);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        particle.position.x,
        particle.position.y,
        particle.position.z
      );
      
      scene.add(sphere);

      return { sphere, particle };
    });

    const gameLoop = () => {
      if (this.shouldStop) {
        return;
      }
      motionSim.update(FRAME_TIME);
      setTimeout(gameLoop, FRAME_TIME);
    };

    const animate = () => {
      if (this.shouldStop) {
        removeScene();
        return;
      }
      sphereParticlePairs.forEach(({ sphere, particle }) => {
        sphere.position.set(
          particle.position.x,
          particle.position.y,
          particle.position.z
        );
      });
      requestAnimationFrame(animate);
      render();
    };

    animate();
    setTimeout(gameLoop, 3000);
  }

  stopAnimation() {
    this.shouldStop = true;
  }
}

const ParticleGravity: NextPage = () => {
  const renderer3D = useRef<Renderer3D>();
  const canvas = useRef<HTMLDivElement>(null);

  const createCube = useCallback(() => {
    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
    }
    if (!canvas.current) return;
    renderer3D.current = new Renderer3D();
    renderer3D.current.startAnimation(canvas.current);
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
        <meta
          name="description"
          content="Gravity simulation for a single particle"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3" component="h1">
        Gravity simulation for a single particle
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={"/particle-gravity"}>{"< Optimize Mesh"}</Link>
        <Link href={"/particle-collision"}>{"Particle Collision >"}</Link>
      </div>

      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <div style={{ flex: 2 }} ref={canvas}></div>
        <Stack spacing={2} style={{ flex: 1 }}>
          <Button onClick={createCube}>Simulate</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ParticleGravity;
