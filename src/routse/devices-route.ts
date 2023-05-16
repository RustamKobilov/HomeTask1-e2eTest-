import {Request, Response, Router} from "express";
import {JwtService} from "../application/jwtService";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";
import {DevicesService} from "../Service/devicesService";

export const securityRouter = Router({})

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

export class DeviceController{
    private devicesService : DevicesService
    private jwtService : JwtService
    constructor() {
        this.devicesService = new DevicesService()
        this.jwtService = new JwtService()
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

        const searchDeviceIdParamsInBaseForUser = await this.devicesService.
        searchDeviceOnTwoParametr(userIdByAndDeviceIdRefreshToken.userId,userIdByAndDeviceIdRefreshToken.deviceId)
        if (!searchDeviceIdParamsInBaseForUser) {
            return res.sendStatus(403)
        }

        await this.devicesService.deleteDevice(userIdByAndDeviceIdRefreshToken.userId,userIdByAndDeviceIdRefreshToken.deviceId)

        return res.sendStatus(204)
    }
}
const deviceController = new DeviceController()

securityRouter.get('/devices',authRefreshToken, deviceController.getDevices)

securityRouter.delete('/devices', authRefreshToken, deviceController.deleteDevices)

securityRouter.delete('/devices/:deviceId', authRefreshToken, deviceController.deleteDeviceOnId)



//admin
securityRouter.get('/attempt', async (req: Request, res: Response) => {
    const allCollection = await RecoveryPasswordModel.find({}).lean()

    return res.send(allCollection).status(204)
})

securityRouter.get('/userAll', async (req: Request, res: Response) => {
    const allCollection = await UserModel.find({}).lean()

    return res.send(allCollection).status(204)
})