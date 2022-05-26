import { Vector } from "../data-structures/vector3";
import { AmmoEngine } from "../utils/ammo-engine/ammo-engine";
import { BodyInfo } from "../utils/ammo-engine/body-info";
import { CommandMessage, ResponseMessage, ResponseMessageType } from "./ammo-worker-types";


// @ts-ignore
importScripts('../../../ammo.wasm.js')

const config = {
    locateFile: () => '../../../ammo.wasm.wasm'
}

declare var Ammo: (config: any) => Promise<any>;

class AmmoWorker {
    private engine?: AmmoEngine;

    constructor() {
        addEventListener('message', async (event) => {
            const data: CommandMessage = event.data;

            switch (data.type) {
                case 'INITIALIZE': {
                    await this.initEngine();
                    const response: ResponseMessage = { type: ResponseMessageType.INITIALIZED, payload: undefined };
                    postMessage(response);
                    break;
                }
                case 'START': {
                    this.start();
                    const response: ResponseMessage = { type: ResponseMessageType.STARTED, payload: undefined };
                    postMessage(response);
                    break;
                }
                case 'DESTROY': {
                    this.destroy();
                    const response: ResponseMessage = { type: ResponseMessageType.DESTROYED, payload: undefined };
                    postMessage(response);
                    break;
                }
                case 'ADD_BOX': {
                    if (!this.engine) return;
                    const {
                        dimensions,
                        position,
                        mass,
                        rotationAxis,
                        angle
                    } = data.payload;
                    const dimensionsObject = JSON.parse(dimensions);
                    const positionObject = JSON.parse(position);
                    const rotationAxisObject = rotationAxis ? JSON.parse(rotationAxis) : undefined;
                    const box = this.engine.addBox(
                        new Vector(dimensionsObject.x, dimensionsObject.y, dimensionsObject.z),
                        new Vector(positionObject.x, positionObject.y, positionObject.z),
                        mass,
                        rotationAxisObject ? new Vector(rotationAxisObject.x, rotationAxisObject.y, rotationAxisObject.z) : undefined,
                        angle
                    );
                    const response: ResponseMessage = {
                        type: ResponseMessageType.BOX_ADDED, payload: {
                            id: box?.getUserIndex()
                        }
                    }
                    postMessage(response);
                    break;
                }

                default:
                    break;
            }
        })
    }

    private onUpdate(bodies: BodyInfo[]) {
        postMessage({
            type: 'BODIES_UPDATE',
            payload: bodies
        })
    }

    private initEngine() {
        if (!this.engine) {
            return Ammo(config).then((api) => {
                this.engine = new AmmoEngine(api);
                this.engine.subscribe(bodies => {
                    this.onUpdate(bodies)
                })
            })
        }
        return Promise.resolve();
    }

    private start() {
        this.engine?.start()
    }

    private destroy() {
        this.engine?.destroy()
    }
}

new AmmoWorker();