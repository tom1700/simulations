import { Vector } from "../data-structures/vector3";
import { BodyInfo } from "../utils/ammo-engine/body-info";
import { CommandMessage, ResponseMessage, ResponseMessageType, SubscriptionMessage } from "./ammo-worker-types";

type ResponseListener<T extends ResponseMessage> = (message: T) => void;

type ResponseListeners = {
    [R in ResponseMessage as R['type']]: ResponseListener<R>[]
}

type BodyListener = (bodyInfo: BodyInfo) => void;

export class AmmoWorkerApi {
    private worker: Worker;
    private responseListeners: ResponseListeners = {
        INITIALIZED: [],
        STARTED: [],
        DESTROYED: [],
        BOX_ADDED: []
    };

    private bodyListeners: {
        [key: number]: BodyListener[]
    } = {};
    private addBoxQueue = Promise.resolve(0);

    constructor() {
        this.worker = new Worker(
            new URL('./ammo-worker.ts', import.meta.url)
        )

        this.worker.addEventListener('message', ({ data }: { data: ResponseMessage | SubscriptionMessage }) => {
            if (data.type === 'BODIES_UPDATE') {
                this.notifyBodyListeners(data.payload);
                return;
            }

            const listeners = this.responseListeners[data.type];
            // I've lost this battle
            // @ts-ignore
            listeners.forEach(listener => listener(data));
            this.responseListeners[data.type] = [];
        })
    }

    private notifyBodyListeners(bodiesInfo: BodyInfo[]) {
        bodiesInfo.forEach(body => {
            const listeners = this.bodyListeners[body.id];
            listeners?.forEach(listener => listener(body))
        })
    }

    private sendMessage(message: CommandMessage) {
        this.worker.postMessage(message)
    }

    private onReponse(type: ResponseMessage['type'], listener: ResponseListener<ResponseMessage>) {
        this.responseListeners[type].push(listener)
    }

    private sendAndWaitForResponse<T extends ResponseMessage>(command: CommandMessage, responseType: ResponseMessage['type']) {
        return new Promise<ResponseMessage>((res) => {
            this.onReponse(responseType, (data) => {
                res(data);
            });
            this.sendMessage(command);
        })
    }

    public async initialize() {
        await this.sendAndWaitForResponse({ type: 'INITIALIZE', payload: undefined }, ResponseMessageType.INITIALIZED)
    }

    public async start() {
        await this.sendAndWaitForResponse({ type: 'START', payload: undefined }, ResponseMessageType.STARTED);
    }

    public async destroy() {
        await this.sendAndWaitForResponse({ type: 'DESTROY', payload: undefined }, ResponseMessageType.DESTROYED);
    }

    public async addBox(dimensions: Vector, position: Vector, mass?: number, rotationAxis?: Vector, angle?: number) {
        this.addBoxQueue = this.addBoxQueue.then(async () => {
            const response = await this.sendAndWaitForResponse({
                type: 'ADD_BOX', payload: {
                    dimensions: dimensions.serialize(),
                    position: position.serialize(),
                    mass,
                    rotationAxis: rotationAxis?.serialize(),
                    angle
                }
            }, ResponseMessageType.BOX_ADDED);

            if (response.type === ResponseMessageType.BOX_ADDED) {
                return response.payload.id;
            }
    
            return 0;
        })

        return this.addBoxQueue;
    }

    public onBodyUpdate(id: number, callback: BodyListener) {
        this.bodyListeners[id] = this.bodyListeners[id] || [];
        this.bodyListeners[id].push(callback);
    }
}