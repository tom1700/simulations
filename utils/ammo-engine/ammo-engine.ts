import { Vector } from "../../data-structures/vector3";
import { Ammo, AmmoApi } from './ammo-types';
import { BodyInfo, BodyParser } from "./body-info";

export class AmmoEngine {
    private world: Ammo.btDiscreteDynamicsWorld;
    private collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
    private dispatcher: Ammo.btCollisionDispatcher;
    private overlappingPairCache: Ammo.btDbvtBroadphase;
    private solver: Ammo.btSequentialImpulseConstraintSolver;
    private nextId = 0;
    private shouldStop = false;
    private api: AmmoApi;
    private subscribers: ((bodies: BodyInfo[]) => void)[] = [];
    private bodies: Ammo.btRigidBody[] = [];
    private bodyInfo: BodyInfo[] = [];
    private bodyParser: BodyParser;

    constructor(api: AmmoApi, gravityStrength = 9.82) {
        this.api = api;
        this.bodyParser = new BodyParser(api);
        this.collisionConfiguration = new api.btDefaultCollisionConfiguration();
        this.dispatcher = new api.btCollisionDispatcher(this.collisionConfiguration);
        this.overlappingPairCache = new api.btDbvtBroadphase();
        this.solver = new api.btSequentialImpulseConstraintSolver();
        this.world = new api.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);

        this.world.setGravity(new api.btVector3(0, -1 * gravityStrength, 0));
    }

    private generateNewId() {
        const newId = this.nextId;
        this.nextId = newId + 1;

        return newId;
    }

    private getQuaternion(rotationAxis: Vector, angle = 0) {
        const { api } = this;
        const rotationAxisWithDefault = rotationAxis ? new api.btVector3(rotationAxis.x, rotationAxis.y, rotationAxis.z) : new api.btVector3(0, 1, 0)
        const rotationQuaternion = new api.btQuaternion(0, 0, 0, 1);
        rotationQuaternion.setRotation(rotationAxisWithDefault, angle)

        return rotationQuaternion;
    }

    public addBox(dimensions: Vector, position: Vector, mass = 0, rotationAxis?: Vector, angle = 0) {
        const { api } = this;
        const shape = new api.btBoxShape(new this.api.btVector3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
        const transform = new api.btTransform();

        transform.setIdentity();
        transform.setOrigin(new api.btVector3(position.x, position.y, position.z));

        const rotationQuaternion = this.getQuaternion(rotationAxis || new Vector(0, 1, 0), angle)
        transform.setRotation(rotationQuaternion);

        const localInertia = new api.btVector3(0, 0, 0);

        const myMotionState = new api.btDefaultMotionState(transform);
        const rbInfo = new api.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
        const body = new api.btRigidBody(rbInfo);
        const id = this.generateNewId();
        body.setUserIndex(id)

        this.world.addRigidBody(body);
        this.bodies.push(body);
        this.bodyInfo.push(this.bodyParser.bodyToBodyInfo(body));

        return body;
    }

    private sendUpdate() {
        this.bodies.forEach((body, index) => {
            this.bodyParser.extractIntoBodyInfo(body, this.bodyInfo[index]);
        })

        this.subscribers.forEach(subscriber => subscriber(this.bodyInfo));
    }

    public start() {
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

    public destroy() {
        this.shouldStop = true;
        this.api.destroy(this.world);
        this.api.destroy(this.solver);
        this.api.destroy(this.overlappingPairCache);
        this.api.destroy(this.dispatcher);
        this.api.destroy(this.collisionConfiguration);
    }

    public subscribe(callback: (bodies: BodyInfo[]) => void) {
        this.subscribers.push(callback)
    }
}
