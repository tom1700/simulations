import type { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Stack, Slider } from "@mui/material";
import Button from "@mui/material/Button";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import * as CANNON from "cannon";
import * as THREE from "three";
import { createBasicScene } from "../utils/create-basic-scene";
import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";

const RADIUS = 1;

const initEngine = (worldSize: number, particlesAmount: number) => {
  // Setup our world
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0); // m/s²

  const particles = new Array(particlesAmount).fill(0).map(() => {
    const particleBody = new CANNON.Body({
      mass: 1, // kg
      position: new CANNON.Vec3(
        getRandomValueWithinBounds(-5, 5),
        getRandomValueWithinBounds(-5, 5),
        getRandomValueWithinBounds(-5, 5)
      ), // m
      shape: new CANNON.Sphere(RADIUS),
    });

    world.addBody(particleBody);

    return particleBody;
  });

  const stone = new CANNON.Material("stone");

  // plane -y
  const planeShapeYmin = new CANNON.Plane();
  const planeYmin = new CANNON.Body({ mass: 0, material: stone });
  planeYmin.addShape(planeShapeYmin);
  planeYmin.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  planeYmin.position.set(0, -worldSize / 2, 0);
  world.addBody(planeYmin);

  // Plane +y
  const planeShapeYmax = new CANNON.Plane();
  const planeYmax = new CANNON.Body({ mass: 0, material: stone });
  planeYmax.addShape(planeShapeYmax);
  planeYmax.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
  planeYmax.position.set(0, worldSize / 2, 0);
  world.addBody(planeYmax);

  // plane -x
  const planeShapeXmin = new CANNON.Plane();
  const planeXmin = new CANNON.Body({ mass: 0, material: stone });
  planeXmin.addShape(planeShapeXmin);
  planeXmin.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
  planeXmin.position.set(-worldSize / 2, 0, 0);
  world.addBody(planeXmin);

  // Plane +x
  const planeShapeXmax = new CANNON.Plane();
  const planeXmax = new CANNON.Body({ mass: 0, material: stone });
  planeXmax.addShape(planeShapeXmax);
  planeXmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
  planeXmax.position.set(worldSize / 2, 0, 0);
  world.addBody(planeXmax);

  // Plane -z
  const planeShapeZmin = new CANNON.Plane();
  const planeZmin = new CANNON.Body({ mass: 0, material: stone });
  planeZmin.addShape(planeShapeZmin);
  planeZmin.position.set(0, 0, -worldSize / 2);
  world.addBody(planeZmin);

  // Plane +z
  const planeShapeZmax = new CANNON.Plane();
  const planeZmax = new CANNON.Body({ mass: 0, material: stone });
  planeZmax.addShape(planeShapeZmax);
  planeZmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
  planeZmax.position.set(0, 0, worldSize / 2);
  world.addBody(planeZmax);

  return { world, particles };
};

const updateMeshPosition = (mesh: THREE.Mesh, body: CANNON.Body) => {
  mesh.position.x = body.position.x;
  mesh.position.y = body.position.y;
  mesh.position.z = body.position.z;
  mesh.quaternion.x = body.quaternion.x;
  mesh.quaternion.y = body.quaternion.y;
  mesh.quaternion.z = body.quaternion.z;
  mesh.quaternion.w = body.quaternion.w;
};

class Renderer3D {
  private shouldStop = false;
  private worldSize: number;
  private particlesAmount: number;
  private onFPSUpdate: (fps: number) => void;

  constructor(
    worldSize: number,
    particlesAmount: number,
    onFPSUpdate: (fps: number) => void
  ) {
    this.worldSize = worldSize;
    this.particlesAmount = particlesAmount;
    this.onFPSUpdate = onFPSUpdate;
  }

  startAnimation(canvasElement: HTMLDivElement) {
    const { world, particles } = initEngine(
      this.worldSize,
      this.particlesAmount
    );
    const { scene, render, removeScene } = createBasicScene(
      canvasElement,
      this.worldSize
    );

    const sphereParticlePairs = particles.map((particle) => {
      const geometry = new THREE.SphereGeometry(RADIUS);
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

    const fixedTimeStep = 1.0 / 60.0;

    const updatePhysics = () => {
      // Step the physics world
      world.step(fixedTimeStep);
      sphereParticlePairs.forEach(({ sphere, particle }) => {
        updateMeshPosition(sphere, particle);
      });
    };
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
      updatePhysics();
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

  const startSimulation = useCallback(() => {
    if (renderer3D.current) {
      renderer3D.current.stopAnimation();
    }
    if (!canvas.current) return;
    renderer3D.current = new Renderer3D(worldSize, particlesAmount, (fps: number) => {
      if(fpsCounterRef.current) {
        fpsCounterRef.current.innerText = fps.toFixed(0);
      }
    });
    renderer3D.current.startAnimation(canvas.current);
  }, [particlesAmount, worldSize]);

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
        <Link href={"/particle-gravity"}>{"< Particle Gravity"}</Link>
        <Link href={"/particle-collision-with-worker"}>{"Particle Collision Web Worker >"}</Link>
      </div>

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
          <div>FPS: <span ref={fpsCounterRef}>0</span></div>
          <Button onClick={startSimulation}>Simulate</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ParticleGravity;
