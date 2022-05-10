export class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getAbsoluteVector() {
        return new Vector(
            Math.abs(this.x),
            Math.abs(this.y),
            Math.abs(this.z)
        )
    }

    getDirectionVector() {
        return new Vector(
            this.x === 0 ? 0 : Math.abs(this.x) / this.x,
            this.y === 0 ? 0 : Math.abs(this.y) / this.y,
            this.z === 0 ? 0 : Math.abs(this.z) / this.z
        )
    }

    getLongest(): 'x' | 'y' | 'z' {
        const absoluteVector = this.getAbsoluteVector();
        if (absoluteVector.x > absoluteVector.y && absoluteVector.x > absoluteVector.z) {
            return 'x';
        }
        if (absoluteVector.y > absoluteVector.z && absoluteVector.y > absoluteVector.x) {
            return 'y'
        }
        return 'z'
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    getNormal() {
        const length = this.getLength();

        return new Vector(
            this.x / length,
            this.y / length,
            this.z / length
        );
    }

    multiply(value: number) {
        return new Vector(
            this.x * value,
            this.y * value,
            this.z * value
        )
    }

    add(vector: Vector) {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        )
    }

    floor() {
        return new Vector(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.z),
        )
    }

    ceil() {
        return new Vector(
            Math.ceil(this.x),
            Math.ceil(this.y),
            Math.ceil(this.z),
        )
    }

    clone() {
        return new Vector(
            this.x,
            this.y,
            this.z,
        )
    }

    addMutate(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    copyMutate(vector: Vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;

        return this;
    }

    multiplyMutate(value: number) {
        this.x *= value;
        this.y *= value;
        this.z *= value;

        return this;
    }

    floorMutate() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);

        return this;
    }

    scalarProduct(vector: Vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
}