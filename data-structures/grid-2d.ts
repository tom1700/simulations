import { LargeNumberLike } from "crypto";

export const to1D = (x: number, y: number, width: number) => {
    return (y * width) + x;
}

export const to2D = (idx: number, width: number) => {
    const y = Math.floor(idx / width);
    const x = idx % width;

    return { x, y };
}

export enum Direction2D {
    TOP = 'TOP', RIGHT = 'RIGHT', LEFT = 'LEFT', BOTTOM = 'BOTTOM'
}

export class Grid2D<T> {
    private _width: number;
    private _height: number;
    private _buffer: Array<T>;
    private neighbourFunctionMap: Record<Direction2D, (x: number, y: number) => number>

    constructor(width: number, height: number, initialValue: T) {
        this._width = width;
        this._height = height;
        this._buffer = new Array(this.width * this.height);
        this.resetBuffer(initialValue);

        this.neighbourFunctionMap = {
            [Direction2D.TOP]: (x: number, y: number) =>
                this.isYWithinBounds(y + 1) ? to1D(x, y + 1, width) : -1,
            [Direction2D.BOTTOM]: (x: number, y: number) =>
                this.isYWithinBounds(y - 1) ? to1D(x, y - 1, width) : -1,
            [Direction2D.LEFT]: (x: number, y: number) =>
                this.isXWithinBounds(x - 1) ? to1D(x - 1, y, width) : -1,
            [Direction2D.RIGHT]: (x: number, y: number) =>
                this.isXWithinBounds(x + 1) ? to1D(x + 1, y, width) : -1,
        }
    }

    private isYWithinBounds(y: number) {
        return y > 0 && y < this.height;
    }

    private isXWithinBounds(x: number) {
        return x > 0 && x < this.width;
    }

    public resetBuffer(val: T) {
        for (let i = 0; i < this._buffer.length; i++) {
            this._buffer[i] = val;
        }
    }

    public getNeighbourIndex(direction: Direction2D, x: number, y: number) {
        return this.neighbourFunctionMap[direction](x, y);
    }

    public hasNeighbour(direction: Direction2D, x: number, y: number) {
        const { _buffer } = this;
        const index = this.getNeighbourIndex(direction, x, y);

        if (index < 0 || index > _buffer.length) return false;

        return !!_buffer[index];
    }

    public getNeighbourValue(direction: Direction2D, x: number, y: number) {
        const { _buffer } = this;
        const index = this.getNeighbourIndex(direction, x, y);
        if (index < 0 || index > _buffer.length) return undefined;

        return _buffer[index];
    }

    public setValue(x: number, y: number, value: T) {
        const { width, height } = this;
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        this._buffer[to1D(x, y, width)] = value;
    }


    public getValue(x: number, y: number) {
        const { width, height } = this;
        if (x < 0 || y < 0 || x >= width || y >= height) return undefined;
        return this._buffer[to1D(x, y, width)];
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public get buffer() {
        return this._buffer;
    }

    public forEach(callback: (value: T, x: number, y: number) => void) {
        this._buffer.forEach((value, index) => {
            const { x, y } = to2D(index, this.width);
            return callback(value, x, y)
        })
    }
}