import * as CANNON from "cannon";
import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";
import { ParticleInfo, WorkerIncomingMessage } from "./types";

const RADIUS = 1;

class EngineWorker {
  private world?: CANNON.World;

  private particles?: CANNON.Body[];

  private particlesInfo: ParticleInfo[] = [];

  private shouldStop = false;

  public initEngine(worldSize: number, particlesAmount: number) {
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
        ),
        shape: new CANNON.Sphere(RADIUS),
      });

      world.addBody(particleBody);

      return particleBody;
    });

    this.particlesInfo = particles.map(particle => ({
      id: particle.id,
      x: particle.position.x,
      y: particle.position.y,
      z: particle.position.z,
      quaternionX: particle.quaternion.x,
      quaternionY: particle.quaternion.y,
      quaternionZ: particle.quaternion.z,
      quaternionW: particle.quaternion.w,
    }))

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

    this.world = world;
    this.particles = particles;
  }

  sendUpdate() {
    if (!this.particles) return;

    this.particles.forEach((particle, index) => {
      this.particlesInfo[index].id = particle.id;
      this.particlesInfo[index].x = particle.position.x;
      this.particlesInfo[index].y = particle.position.y;
      this.particlesInfo[index].z = particle.position.z;
      this.particlesInfo[index].quaternionX = particle.quaternion.x;
      this.particlesInfo[index].quaternionY = particle.quaternion.y;
      this.particlesInfo[index].quaternionZ = particle.quaternion.z;
      this.particlesInfo[index].quaternionW = particle.quaternion.w;
    })

    postMessage(this.particlesInfo);
  }

  start() {
    this.shouldStop = false;
    const fixedTimeStep = 1.0 / 60.0; // seconds
    const maxSubSteps = 3;

    // Start the simulation loop
    let lastTime = Date.now() - fixedTimeStep * 1000;

    const simloop = (time: number) => {
      if (this.shouldStop) return;

      requestAnimationFrame(simloop);

      var dt = (time - lastTime) / 1000;
      console.time('Simulate')
      this.world?.step(fixedTimeStep, dt, maxSubSteps);
      console.timeEnd('Simulate')
      this.sendUpdate();
      lastTime = time;
    };

    simloop(lastTime + fixedTimeStep * 1000);
  }

  stop() {
    this.shouldStop = true;
  }
}

const engine = new EngineWorker();

addEventListener('message', (event) => {
  const data: WorkerIncomingMessage = event.data;

  if (data.type === 'INITIALIZE') {
    const { worldSize, particlesAmount } = event.data;
    engine.initEngine(worldSize, particlesAmount)
  }
  if (data.type === 'START') {
    engine.start();
  }
  if (data.type === 'STOP') {
    engine.stop()
  }
})