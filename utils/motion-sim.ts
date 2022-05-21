import { Particle } from "../actors/particle";
import { Vector } from "../data-structures/vector3";

interface ParticleWithAcceleration {
    particle: Particle,
    velocity: Vector
}

export class MotionSim {
    private particles: ParticleWithAcceleration[];
    private gravityDirection = new Vector(0, -1, 0);
    private gravityForce = 9.8;
    private worldSize: number;
    // Those two are just containers. I'm using them for performance reason, to avoid creating new objects.
    private velocityIncrease = new Vector(0, 0, 0);
    private newPosition = new Vector(0, 0, 0);

    constructor(particles: Particle[], worldSize: number) {
        this.particles = particles.map(particle => ({
            particle,
            velocity: new Vector(0, 0, 0)
        }));
        this.worldSize = worldSize;
    }

    private ensureWorldBounds(position: Vector, particleRadius: number) {
        if (position.x <= particleRadius) {
            position.x = particleRadius;
        }
        if (position.x >= this.worldSize - particleRadius) {
            position.x = this.worldSize - particleRadius;
        }
        if (position.y <= particleRadius) {
            position.y = particleRadius;
        }
        if (position.y >= this.worldSize - particleRadius) {
            position.y = this.worldSize - particleRadius;
        }
        if (position.z <= particleRadius) {
            position.z = particleRadius;
        }
        if (position.z >= this.worldSize - particleRadius) {
            position.z = this.worldSize - particleRadius;
        }
    }

    update(periodMs: number) {
        this.velocityIncrease.cloneFrom(this.gravityDirection).multiplyMutate(this.gravityForce * periodMs / 1000);

        this.particles.forEach(particle => {
            particle.velocity.addMutate(this.velocityIncrease);
        })

        this.particles.forEach(particle => {
            this.newPosition.cloneFrom(particle.particle.position).addMutate(particle.velocity);
            this.ensureWorldBounds(this.newPosition, particle.particle.radius);
            particle.particle.position.cloneFrom(this.newPosition);
        })
    }
}