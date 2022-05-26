import { AmmoApi, Ammo } from './ammo-types';

export interface BodyInfo {
    id: number,
    x: number,
    y: number,
    z: number,
    quaternionX: number,
    quaternionY: number,
    quaternionZ: number,
    quaternionW: number,
}

export class BodyParser {
    private transformContainer: Ammo.btTransform;
    private api: AmmoApi;

    constructor(api: AmmoApi) {
        this.api = api;
        this.transformContainer = new this.api.btTransform();
    }

    public bodyToBodyInfo(body: Ammo.btRigidBody) {
        body.getMotionState().getWorldTransform(this.transformContainer);
        const origin = this.transformContainer.getOrigin()
        const quaternion = this.transformContainer.getRotation();

        return ({
            id: body.getUserIndex(),
            x: origin.x(),
            y: origin.y(),
            z: origin.z(),
            quaternionX: quaternion.x(),
            quaternionY: quaternion.y(),
            quaternionZ: quaternion.z(),
            quaternionW: quaternion.w(),
        })
    }

    public extractIntoBodyInfo(body: Ammo.btRigidBody, bodyInfo: BodyInfo) {
        body.getMotionState().getWorldTransform(this.transformContainer);
        const origin = this.transformContainer.getOrigin()
        const quaternion = this.transformContainer.getRotation();

        bodyInfo.id = body.getUserIndex();
        bodyInfo.x = origin.x();
        bodyInfo.y = origin.y();
        bodyInfo.z = origin.z();
        bodyInfo.quaternionX = quaternion.x();
        bodyInfo.quaternionY = quaternion.y();
        bodyInfo.quaternionZ = quaternion.z();
        bodyInfo.quaternionW = quaternion.w();
    }
}
