export class Quattree {
    public size: number;
    public startX: number;
    public startY: number;
    public bottomLeftFront?: Quattree;
    public bottomRightFront?: Quattree;
    public topLeftFront?: Quattree;
    public topRightFront?: Quattree;

    constructor(size: number, startX = 0, startY = 0) {
        this.size = size;
        this.startX = startX;
        this.startY = startY;

        const newSize = size / 2;
        const isLeaf = newSize <= 1;

        this.bottomLeftFront = isLeaf ? undefined : new Quattree(newSize, startX, startY);
        this.bottomRightFront = isLeaf ? undefined : new Quattree(newSize, startX + newSize, startY);

        this.bottomLeftFront = isLeaf ? undefined : new Quattree(newSize, startX, startY + newSize);
        this.bottomRightFront = isLeaf ? undefined : new Quattree(newSize, startX + newSize, startY + newSize);
    }
}