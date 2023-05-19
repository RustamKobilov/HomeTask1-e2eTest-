import {Request, Response, Router} from "express";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";
import {devicesController} from "../composition-root";


export const securityRouter = Router({})


securityRouter.get('/devices',authRefreshToken, devicesController.getDevices.bind(devicesController))

securityRouter.delete('/devices', authRefreshToken, devicesController.deleteDevices.bind(devicesController))

securityRouter.delete('/devices/:deviceId', authRefreshToken, devicesController.deleteDeviceOnId.bind(devicesController))


//admin
securityRouter.get('/attempt', async (req: Request, res: Response) => {
    const allCollection = await RecoveryPasswordModel.find({}).lean()

    return res.send(allCollection).status(204)
})

securityRouter.get('/userAll', async (req: Request, res: Response) => {
    const allCollection = await UserModel.find({}).lean()

    return res.send(allCollection).status(204)
})