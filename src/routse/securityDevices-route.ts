import {Request, Response, Router} from "express";
import {securityAttemptsEndpoints, sessionsTypeCollection} from "../db";
import {PaginationTypeInputParamsBlogs} from "../RepositoryInDB/blog-repositoryDB";
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import {ActiveSessionsType, jwtService} from "../application/jwtService";
import {authRefreshToken} from "../Middleware/authRefreshToken";

export const securityRouter = Router({})

export const getPaginationValuesInputUserInformation = (ipAddress: any, userAgent: any): UserInformationType => {
    return {
        ipAddress: ipAddress,
        deviceName: userAgent

    }
}
export type UserInformationType = {
    deviceName: string,
    ipAddress: string,
}

export type SecurityOfAttemptsType ={
    endPointName:string,
    ip:string,
    dateAttempt:string
}



securityRouter.get('/devices',authRefreshToken, async (req: Request, res: Response) => {
    const allCollection = await sessionsTypeCollection
        .find({}, {projection: {_id: 0, title: '$deviceName',ip:1,lastActiveDate:1,deviceId:1}}).toArray()

    return res.send(allCollection).status(200)
})

securityRouter.delete('/devices', authRefreshToken, async (req: Request, res: Response) => {
    const inputRefreshToken = req.cookies.refreshToken
    const userIdByAndDeviceIdRefreshToken = await jwtService.verifyToken(inputRefreshToken)

    const deleteSessionEveryoneBut = await sessionsTypeCollection.deleteMany({
        userId: userIdByAndDeviceIdRefreshToken.userId,
        deviceId: {$ne: userIdByAndDeviceIdRefreshToken.deviceId}
    })

    return res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId', authRefreshToken, async (req: Request, res: Response) => {
    const inputRefreshToken = req.cookies.refreshToken
    const userIdByAndDeviceIdRefreshToken = await jwtService.verifyToken(inputRefreshToken)

    const searchDeviceIdParamsInBase = await sessionsTypeCollection
        .findOne({deviceId: req.params.deviceId})
    if (!searchDeviceIdParamsInBase) {
        return res.sendStatus(404)
    }

    const searchDeviceIdParamsInBaseForUser = await sessionsTypeCollection
        .findOne({userId: userIdByAndDeviceIdRefreshToken.userId, deviceId: req.params.deviceId})
    if (!searchDeviceIdParamsInBaseForUser) {
        return res.sendStatus(403)
    }

    const deleteSessionEveryoneBut = await sessionsTypeCollection.deleteMany({
        userId: userIdByAndDeviceIdRefreshToken.userId,
        deviceId: req.params.deviceId
    })

    return res.sendStatus(204)
})

securityRouter.get('/attempt',authRefreshToken, async (req: Request, res: Response) => {
    const allCollection = await securityAttemptsEndpoints.find({}).toArray()

    return res.send(allCollection).status(204)
})