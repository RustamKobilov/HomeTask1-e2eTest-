import {DeviceService} from "../Service/deviceService";
import {JwtService} from "../application/jwtService";
import {Request, Response} from "express";


export const getPaginationValuesInputUserInformation = (ipAddress: any, userAgent: any): UserInformationType => {
    return {
        ipAddress: ipAddress,
        title: userAgent

    }
}
export type UserInformationType = {
    title: string,
    ipAddress: string,
}
export type SecurityOfAttemptsType ={
    endPointName:string,
    ip:string,
    dateAttempt:string
}


export class DeviceController {

    constructor(protected devicesService: DeviceService, protected jwtService: JwtService) {
    }

    async getDevices(req: Request, res: Response) {
        const inputRefreshToken = req.cookies.refreshToken
        const devices = await this.devicesService.getAllDevices(inputRefreshToken)

        return res.send(devices).status(200)
    }

    async deleteDevices(req: Request, res: Response) {
        const inputRefreshToken = req.cookies.refreshToken
        await this.devicesService.deleteDevicesExceptForHim(inputRefreshToken)

        return res.sendStatus(204)
    }

    async deleteDeviceOnId(req: Request, res: Response) {
        const inputRefreshToken = req.cookies.refreshToken
        const userIdByAndDeviceIdRefreshToken = await this.jwtService.verifyToken(inputRefreshToken)

        const searchDeviceIdParamsInBase = await this.devicesService.searchDevice(userIdByAndDeviceIdRefreshToken.userId)
        if (!searchDeviceIdParamsInBase) {
            return res.sendStatus(404)
        }

        const searchDeviceIdParamsInBaseForUser = await this.devicesService.searchDeviceOnTwoParametr(userIdByAndDeviceIdRefreshToken.userId, userIdByAndDeviceIdRefreshToken.deviceId)
        if (!searchDeviceIdParamsInBaseForUser) {
            return res.sendStatus(403)
        }

        await this.devicesService.deleteDevice(userIdByAndDeviceIdRefreshToken.userId, userIdByAndDeviceIdRefreshToken.deviceId)

        return res.sendStatus(204)
    }
}


