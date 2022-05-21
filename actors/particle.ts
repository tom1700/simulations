import { Vector } from "../data-structures/vector3";

export class Particle {
    private _position: Vector;
    private _radius: number;
    private _hardness: number;
    private _density: number;
    private _volume: number = 0;
    private _mass: number = 0;

    constructor(position: Vector, radius = 1, hardness = 1, density = 1) {
        this._position = position;
        this._radius = radius;
        this._hardness = hardness;
        this._density = density;
        this.updateVolumeAndMass();
    }

    private updateVolumeAndMass() {
        this._volume = (4 / 3) * Math.PI * Math.pow(this.radius, 3);
        this._mass = this._volume * this.density;
    }

    public get position() {
        return this._position;
    }

    public get radius() {
        return this._radius;
    }

    public get hardness() {
        return this._hardness;
    }

    public get density() {
        return this._density;
    }

    public get volume() {
        return this._volume;
    }

    public get mass() {
        return this._mass;
    }

    public set position(position: Vector) {
        this.position = position;
    }

    public set radius(radius: number) {
        this.radius = radius;
        this.updateVolumeAndMass();
    }

    public setHardness(hardness: number) {
        this._hardness = hardness;
    }
    
    public setDensity(density: number) {
        this._density = density;
    }
}