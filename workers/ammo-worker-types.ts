import { BodyInfo } from "../utils/ammo-engine/body-info";



interface Message<T extends string, K> {
    type: T,
    payload: K
}

export type SubscriptionMessage = {
    type: 'BODIES_UPDATE',
    payload: BodyInfo[]
}

type InitializeCommandMessage = Message<'INITIALIZE', undefined>;
type StartCommandMessage = Message<'START', undefined>;
type DestroyCommandMessage = Message<'DESTROY', undefined>;
type AddBoxCommandMessage = Message<'ADD_BOX', {
    dimensions: string,
    position: string,
    mass?: number,
    rotationAxis?: string,
    angle?: number
}>

export type CommandMessage =
    InitializeCommandMessage |
    StartCommandMessage |
    DestroyCommandMessage |
    AddBoxCommandMessage;

export enum ResponseMessageType {
    INITIALIZED = 'INITIALIZED',
    STARTED = 'STARTED',
    DESTROYED = 'DESTROYED',
    BOX_ADDED = 'BOX_ADDED'
}

type InitializedResponseMessage = Message<ResponseMessageType.INITIALIZED, undefined>;
type StartedResponseMessage = Message<ResponseMessageType.STARTED, undefined>;
type DestroyedResponseMessage =
    Message<ResponseMessageType.DESTROYED, undefined>;
type BoxAddedResponseMessage = Message<ResponseMessageType.BOX_ADDED, {
    id: number
}>;

export type ResponseMessage =
    InitializedResponseMessage |
    StartedResponseMessage |
    DestroyedResponseMessage |
    BoxAddedResponseMessage;
