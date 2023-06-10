import {Request, Response, Router} from "express";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {AttemptModel, ReactionModel} from "../Models/shemaAndModel";
import {Containers} from "../composition-root";
import {DeviceController} from "../Controllers/device-controller";

const devicesController = Containers.resolve(DeviceController)
export const securityRouter = Router({})


securityRouter.get('/devices',authRefreshToken, devicesController.getDevices.bind(devicesController))

securityRouter.delete('/devices', authRefreshToken, devicesController.deleteDevices.bind(devicesController))

securityRouter.delete('/devices/:deviceId', authRefreshToken, devicesController.deleteDeviceOnId.bind(devicesController))




securityRouter.get('/userAll', async (req: Request, res: Response) => {

    //const reaction :IReaction = new Reaction('fc2f2ff3-f389-476f-be2f-5a0aff2d3068','1d4ca97c-fd85-46fa-a74b-85eea30e211a','kklkjj',likeStatus.Like, 'gghhge')

    //await ReactionModel.insertMany(reaction)
    const attempt = {endpointName:'/login',ip:'::ffff:127.0.0.1',dateAttempt:new Date().toISOString()}
    const getAttempt= await AttemptModel
        .countDocuments({endPointName:attempt.endpointName, ip:attempt.ip,dateAttempt:{$gte:attempt.dateAttempt}})
    console.log(getAttempt)
    //dateAttempt:{$gte:attempt.dateAttempt}
    const allCollection = await AttemptModel.find({}).lean()


    return res.send(allCollection).status(204)
})

securityRouter.get('/userAllhard', async (req: Request, res: Response) => {

    //const reaction :IReaction = new Reaction('kdkdkf','ffgfgf','kklkjj',likeStatus.Like, 'gghhge')

    const allCollection = await ReactionModel.find({}).lean()

    //const allCollection = await helper.getReactionUserForParent("commentId","user.id")

    return res.send(allCollection).status(204)
})