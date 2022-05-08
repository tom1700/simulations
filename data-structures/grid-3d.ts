
export const to1D = (x: number, y: number, z: number, width: number, height: number) => {
    return (z * width * height) + (y * width) + x;
}

export const to3D = (idx: number, width: number, height: number) => {
    const z = Math.floor(idx / (width * height));
    idx -= (z * width * height);
    const y = Math.floor(idx / width);
    const x = idx % width;

    return { x, y, z };
}

export enum Direction {
    TOP = 'TOP', RIGHT = 'RIGHT', LEFT = 'LEFT', BOTTOM = 'BOTTOM', FRONT = 'FRONT', BACK = 'BACK'
}

export class Grid3D {
    private _width: number;
    private _height: number;
    private _depth: number;
    private buffer: Array<string>;
    private neighbourFunctionMap: Record<Direction, (x: number, y: number, z: number) => number>

    constructor(width: number, height: number, depth: number) {
        this._width = width;
        this._height = height;
        this._depth = depth;
        this.buffer = new Array(this.width * this.depth * this.height);
        this.resetBuffer();

        this.neighbourFunctionMap = {
            [Direction.TOP]: (x: number, y: number, z: number) =>
                to1D(x, y + 1, z, width, height),
            [Direction.BOTTOM]: (x: number, y: number, z: number) =>
                to1D(x, y - 1, z, width, height),
            [Direction.BACK]: (x: number, y: number, z: number) =>
                to1D(x, y, z - 1, width, height),
            [Direction.FRONT]: (x: number, y: number, z: number) =>
                to1D(x, y, z + 1, width, height),
            [Direction.LEFT]: (x: number, y: number, z: number) =>
                to1D(x - 1, y, z, width, height),
            [Direction.RIGHT]: (x: number, y: number, z: number) =>
                to1D(x + 1, y, z, width, height),
        }
    }

    public resetBuffer() {
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = '';
        }
    }

    public getNeighbourIndex(direction: Direction, x: number, y: number, z: number) {
        return this.neighbourFunctionMap[direction](x, y, z);
    }

    public hasNeighbour = (direction: Direction, x: number, y: number, z: number) => {
        const { buffer } = this;
        const index = this.getNeighbourIndex(direction, x, y, z);

        if (index < 0 || index > buffer.length) return false;

        return !!buffer[index];
    }

    public setValue(x: number, y: number, z: number, value: string) {
        const { width, height, depth } = this;
        if (x < 0 || y < 0 || z < 0 || x >= width || y >= height || z >= depth) return;
        this.buffer[to1D(x, y, z, width, height)] = value;
    }


    public getValue(x: number, y: number, z: number) {
        const { width, height, depth } = this;
        if (x < 0 || y < 0 || z < 0 || x >= width || y >= height || z >= depth) return undefined;
        return this.buffer[to1D(x, y, z, width, height)];
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public get depth() {
        return this._depth;
    }

    public forEach(callback: (value: string, x: number, y: number, z: number) => void) {
        this.buffer.forEach((value, index) => {
            const { x, y, z } = to3D(index, this.width, this.height);
            return callback(value, x, y, z)
        })
    }
}