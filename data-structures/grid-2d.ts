
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
    private buffer: Array<T>;
    private neighbourFunctionMap: Record<Direction2D, (x: number, y: number) => number>

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.buffer = new Array(this.width * this.height);
        this.resetBuffer();

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
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i] = val;
        }
    }

    public getNeighbourIndex(direction: Direction2D, x: number, y: number) {
        return this.neighbourFunctionMap[direction](x, y);
    }

    public hasNeighbour(direction: Direction2D, x: number, y: number) {
        const { buffer } = this;
        const index = this.getNeighbourIndex(direction, x, y);

        if (index < 0 || index > buffer.length) return false;

        return !!buffer[index];
    }

    public getNeighbourValue(direction: Direction2D, x: number, y: number) {
        const { buffer } = this;
        const index = this.getNeighbourIndex(direction, x, y);
        if (index < 0 || index > buffer.length) return undefined;

        return buffer[index];
    }

    public setValue(x: number, y: number, value: T) {
        const { width, height } = this;
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        this.buffer[to1D(x, y, width)] = value;
    }


    public getValue(x: number, y: number) {
        const { width, height } = this;
        if (x < 0 || y < 0 || x >= width || y >= height) return undefined;
        return this.buffer[to1D(x, y, width)];
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    public forEach(callback: (value: T, x: number, y: number) => void) {
        this.buffer.forEach((value, index) => {
            const { x, y } = to2D(index, this.width);
            return callback(value, x, y)
        })
    }
}