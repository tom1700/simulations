export class Octree {
    public size: number;
    public startX: number;
    public startY: number;
    public startZ: number;
    public bottomLeftBack?: Octree;
    public bottomLeftFront?: Octree;
    public bottomRightBack?: Octree;
    public bottomRightFront?: Octree;
    public topLeftBack?: Octree;
    public topLeftFront?: Octree;
    public topRightBack?: Octree;
    public topRightFront?: Octree;

    constructor(size: number, startX = 0, startY = 0, startZ = 0) {
        this.size = size;
        this.startX = startX;
        this.startY = startY;
        this.startZ = startZ;

        const newSize = size / 2;
        const isLeaf = newSize <= 1;

        this.bottomLeftBack = isLeaf ? undefined : new Octree(newSize, startX, startY, startZ);
        this.bottomLeftFront = isLeaf ? undefined : new Octree(newSize, startX, startY, startZ + newSize);
        this.bottomRightBack = isLeaf ? undefined : new Octree(newSize, startX + newSize, startY, startZ);
        this.bottomRightFront = isLeaf ? undefined : new Octree(newSize, startX + newSize, startY, startZ + newSize);

        this.bottomLeftBack = isLeaf ? undefined : new Octree(newSize, startX, startY + newSize, startZ);
        this.bottomLeftFront = isLeaf ? undefined : new Octree(newSize, startX, startY + newSize, startZ + newSize);
        this.bottomRightBack = isLeaf ? undefined : new Octree(newSize, startX + newSize, startY + newSize, startZ);
        this.bottomRightFront = isLeaf ? undefined : new Octree(newSize, startX + newSize, startY + newSize, startZ + newSize);
    }
}