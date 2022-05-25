import { getRandomValueWithinBounds } from "../utils/get-random-value-within-bounds";
import { ParticleInfo, WorkerIncomingMessage } from "./types";

const RADIUS = 1;

// @ts-ignore
importScripts('../../../ammo.wasm.js')

const config = {
    locateFile: () => '../../../ammo.wasm.wasm'
}

declare var Ammo: (config: any) => Promise<any>;

interface AmmoVector {
    x: () => number;
    y: () => number;
    z: () => number;
}

interface AmmoQuaternion {
    x: () => number;
    y: () => number;
    z: () => number;
    w: () => number;
}

interface AmmoTransform {
    getOrigin: () => AmmoVector;
    getRotation: () => AmmoQuaternion;
};

interface AmmoMotionState {
    getWorldTransform: (target: AmmoTransform) => void;
}

interface AmmoBody {
    getMotionState: () => AmmoMotionState | undefined
}

interface AmmoDiscreteDynamicsWorld {
    setGravity: (vector: any) => void;
    addRigidBody: (body: AmmoBody) => void;
    stepSimulation: (time: number, deltaTime: number) => void;
}

class EngineWorker {
    private world?: AmmoDiscreteDynamicsWorld;

    private particles?: AmmoBody[];

    private particlesInfo: ParticleInfo[] = [];

    private shouldStop = false;

    private trans?: AmmoTransform;

    private ammo: any;

    private loadAmmo() {
        if (!this.ammo) {
            return Ammo(config).then((ammo) => {
                this.ammo = ammo;
            })
        }
        return Promise.resolve();
    }

    private getBoundry = (worldSize: number, x: number, y: number, z: number) => {
        const Ammo = this.ammo;
        if (!Ammo) return;

        const shape = new Ammo.btBoxShape(new Ammo.btVector3(worldSize / 2, worldSize / 2, worldSize / 2));
        const transform = new Ammo.btTransform();

        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(x, y, z));

        const mass = 0;
        const localInertia = new Ammo.btVector3(0, 0, 0);

        const myMotionState = new Ammo.btDefaultMotionState(transform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        return body;
    }

    private initializeBoundries(worldSize: number) {
        const Ammo = this.ammo;
        if (!Ammo) return;
        const width = worldSize;
        const half = width / 2;
        const floor = this.getBoundry(worldSize, half, -half, half);
        const left = this.getBoundry(worldSize, -half, half, half);
        const right = this.getBoundry(worldSize, width + half, half, half);
        const back = this.getBoundry(worldSize, half, half, -half);
        const front = this.getBoundry(worldSize, half, half, width + half);

        this.world?.addRigidBody(floor);
        this.world?.addRigidBody(left);
        this.world?.addRigidBody(right);
        this.world?.addRigidBody(back);
        this.world?.addRigidBody(front);
    }

    public initEngine(worldSize: number, particlesAmount: number) {
        this.loadAmmo().then(() => {
            const Ammo = this.ammo;
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const overlappingPairCache = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();
            this.world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

            this.world?.setGravity(new Ammo.btVector3(0, -9.82, 0));

            this.initializeBoundries(worldSize);

            this.particles = new Array(particlesAmount).fill(0).map(() => {
                const colShape = new Ammo.btSphereShape(RADIUS);
                const startTransform = new Ammo.btTransform();

                startTransform.setIdentity();

                const mass = 1;
                const localInertia = new Ammo.btVector3(0, 0, 0);

                colShape.calculateLocalInertia(mass, localInertia);

                startTransform.setOrigin(new Ammo.btVector3(
                    getRandomValueWithinBounds(0, worldSize),
                    getRandomValueWithinBounds(0, worldSize),
                    getRandomValueWithinBounds(0, worldSize)
                ));

                const myMotionState = new Ammo.btDefaultMotionState(startTransform);
                const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia);
                const body = new Ammo.btRigidBody(rbInfo);

                this.world?.addRigidBody(body);

                return body;
            });

            const trans: AmmoTransform = new Ammo.btTransform();
            this.trans = trans;
            this.particlesInfo = this.particles.map((particle, index) => {
                particle.getMotionState()?.getWorldTransform(trans);
                const origin = trans.getOrigin();
                const quaternion = trans.getRotation();

                return ({
                    id: index,
                    x: origin.x(),
                    y: origin.y(),
                    z: origin.z(),
                    quaternionX: quaternion.x(),
                    quaternionY: quaternion.y(),
                    quaternionZ: quaternion.z(),
                    quaternionW: quaternion.w(),
                })
            })
        });
    }

    sendUpdate() {
        if (!this.particles) return;

        const trans = this.trans;

        if (!trans) return;

        this.particles.forEach((particle, index) => {
            particle.getMotionState()?.getWorldTransform(trans);
            const origin = trans.getOrigin()
            const quaternion = trans.getRotation();

            this.particlesInfo[index].id = index;
            this.particlesInfo[index].x = origin.x();
            this.particlesInfo[index].y = origin.y();
            this.particlesInfo[index].z = origin.z();
            this.particlesInfo[index].quaternionX = quaternion.x();
            this.particlesInfo[index].quaternionY = quaternion.y();
            this.particlesInfo[index].quaternionZ = quaternion.z();
            this.particlesInfo[index].quaternionW = quaternion.w();
        })

        postMessage(this.particlesInfo);
    }

    start() {
        this.shouldStop = false;
        const fixedTimeStep = 1.0 / 60.0; // seconds

        // Start the simulation loop
        let lastTime = Date.now() - fixedTimeStep * 1000;

        const simloop = (time: number) => {
            if (this.shouldStop) return;

            requestAnimationFrame(simloop);

            var dt = (time - lastTime) / 1000;
            this.world?.stepSimulation(fixedTimeStep, dt);
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