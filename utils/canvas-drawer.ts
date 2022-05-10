export class CanvasDrawer {
    private context: ImageBitmapRenderingContext | null;

    constructor(canvasElement: HTMLCanvasElement) {
        this.context = canvasElement.getContext('bitmaprenderer');
    }

    async drawBitmap(array: Uint32Array, size: number) {
        const clampedArray = new Uint8ClampedArray(array.buffer);
        const iData = new ImageData(clampedArray, size, size);
        const bitmap = await createImageBitmap(iData);

        this.context?.transferFromImageBitmap(bitmap)
    }
}