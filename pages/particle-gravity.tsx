import type { NextPage } from "next";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useRef } from "react";
import { createBasicScene } from "../utils/create-basic-scene";
import { Vector } from "../data-structures/vector3";
import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";
import { Particle } from "../actors/particle";
import { MotionSim } from "../utils/motion-sim";
import * as THREE from "three";
import { Page } from "../components/Page";

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

  const startSimulation = useCallback(() => {
    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
    }
    if (!canvas.current) return;
    renderer3D.current = new Renderer3D();
    renderer3D.current.startAnimation(canvas.current);
  }, []);

  return (
    <Page
      title="Gravity simulation for a bunch of particles"
      subtitle={`There are no collisions between them`}
      backLink="/optimize-mesh"
      backLabel="< Optimize Mesh"
      forwardLink="/particle-collision"
      forwardLabel="Particle Collision >"
    >
      <Stack spacing={2} direction="row" style={{ flex: 1 }}>
        <div style={{ flex: 2 }} ref={canvas}></div>
        <Stack spacing={2} style={{ flex: 1 }}>
          <Button onClick={startSimulation}>Simulate</Button>
        </Stack>
      </Stack>
    </Page>
  );
};

export default ParticleGravity;
