import { injectable } from "inversify";
import {DeviceModel} from "../Models/shemaAndModel";

export class Device {
    constructor(public lastActiveDate: string,
                public diesAtDate: string,
                public deviceId: string,
                public title: string,
                public ip: string) {}
}

@injectable()
export class DeviceRepository{
    async getDevices(userPayload:any):Promise<Device>{
        return await DeviceModel.find({userId: userPayload.userId}, {_id: false, __v: false,userId:false,diesAtDate:false}).lean()
    }

    async deleteDevices(userPayload: any) {

        await DeviceModel.deleteMany({
            userId: userPayload.userId,
            deviceId: {$ne: userPayload.deviceId}
        })

    }
    async getDevice(id:any):Promise<null|Device> {
        return await DeviceModel.findOne({deviceId: id})
    }
    async getDeviceTwoParametr(userId:string,deviceId:string):Promise<null|Device>{
        return await DeviceModel.findOne({userId: userId, deviceId: deviceId})
    }
    async deleteDevice(userId:string,deviceId:string){
        await DeviceModel.deleteMany({
            userId: userId,
            deviceId:deviceId
        })
    }
}