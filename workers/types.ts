export interface ParticleInfo {
    id: number,
    x: number,
    y: number,
    z: number,
    quaternionX: number,
    quaternionY: number,
    quaternionZ: number,
    quaternionW: number,
}

export interface StopMessage {
    type: 'STOP'
}

export interface InitializeMessage {
    type: 'INITIALIZE',
    worldSize: number,
    particlesAmount: number
}

export interface StartMessage {
    type: 'START'
}

export type WorkerIncomingMessage = StopMessage | InitializeMessage | StartMessage;