import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwtService";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {DeviceModel, RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";

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



securityRouter.get('/devices',authRefreshToken, async (req: Request, res: Response) => {
    const inputRefreshToken = req.cookies.refreshToken
    const userIdByAndDeviceIdRefreshToken = await jwtService.verifyToken(inputRefreshToken)

    const allCollection = await DeviceModel
        .find({userId:userIdByAndDeviceIdRefreshToken.userId},{_id: 0, __v: 0}).lean()

    return res.send(allCollection).status(200)
})

securityRouter.delete('/devices', authRefreshToken, async (req: Request, res: Response) => {
    const inputRefreshToken = req.cookies.refreshToken
    const userIdByAndDeviceIdRefreshToken = await jwtService.verifyToken(inputRefreshToken)

    const deleteSessionEveryoneBut = await DeviceModel.deleteMany({
        userId: userIdByAndDeviceIdRefreshToken.userId,
        deviceId: {$ne: userIdByAndDeviceIdRefreshToken.deviceId}
    })

    return res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId', authRefreshToken, async (req: Request, res: Response) => {
    const inputRefreshToken = req.cookies.refreshToken
    const userIdByAndDeviceIdRefreshToken = await jwtService.verifyToken(inputRefreshToken)

    const searchDeviceIdParamsInBase = await DeviceModel
        .findOne({deviceId: req.params.deviceId})
    if (!searchDeviceIdParamsInBase) {
        return res.sendStatus(404)
    }

    const searchDeviceIdParamsInBaseForUser = await DeviceModel
        .findOne({userId: userIdByAndDeviceIdRefreshToken.userId, deviceId: req.params.deviceId})
    if (!searchDeviceIdParamsInBaseForUser) {
        return res.sendStatus(403)
    }

    const deleteSessionEveryoneBut = await DeviceModel.deleteMany({
        userId: userIdByAndDeviceIdRefreshToken.userId,
        deviceId: req.params.deviceId
    })

    return res.sendStatus(204)
})

//admin
securityRouter.get('/attempt', async (req: Request, res: Response) => {
    const allCollection = await RecoveryPasswordModel.find({}).lean()

    return res.send(allCollection).status(204)
})

securityRouter.get('/userAll', async (req: Request, res: Response) => {
    const allCollection = await UserModel.find({}).lean()

    return res.send(allCollection).status(204)
})