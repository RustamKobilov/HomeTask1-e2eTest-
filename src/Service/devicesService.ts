import {JwtService} from "../application/jwtService";
import {DeviceRepository} from "../RepositoryInDB/device-repositoryDB";

export class DevicesService{
    private deviceRepository : DeviceRepository
    private jwtService : JwtService

    constructor() {
        this.deviceRepository = new DeviceRepository()
        this.jwtService = new JwtService()
    }
    async getAllDevices(refreshToken:string){
        const userPayload = await this.jwtService.verifyToken(refreshToken)
       return await this.deviceRepository.getDevices(userPayload)
    }
    async deleteDevicesExceptForHim(refreshToken:string) {
        const userPayload = await this.jwtService.verifyToken(refreshToken)
    return await this.deviceRepository.deleteDevices(userPayload)
    }
    async searchDevice(id:string) {
        return await this.deviceRepository.getDevice(id)
    }
    async searchDeviceOnTwoParametr(userId:string,deviceId:string){
        return await this.deviceRepository.getDeviceTwoParametr(userId,deviceId)
    }
    async deleteDevice(userId:string,deviceId:string){
        return await this.deviceRepository.deleteDevice(userId,deviceId)
    }
}