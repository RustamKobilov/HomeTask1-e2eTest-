import {Request, Response, Router} from "express";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {CommentModel, DeviceModel, IReaction, ReactionModel, RecoveryPasswordModel} from "../Models/shemaAndModel";
import {devicesController} from "../composition-root";
import {likeStatus} from "../Models/Enums";
import {Reaction} from "../RepositoryInDB/reaction-repository";
import {helper} from "../Service/helper";


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

    //const reaction :IReaction = new Reaction('fc2f2ff3-f389-476f-be2f-5a0aff2d3068','1d4ca97c-fd85-46fa-a74b-85eea30e211a','kklkjj',likeStatus.Like, 'gghhge')

    //await ReactionModel.insertMany(reaction)

    const allCollection = await CommentModel.find({}).lean()

    return res.send(allCollection).status(204)
})

securityRouter.get('/userAllhard', async (req: Request, res: Response) => {

    //const reaction :IReaction = new Reaction('kdkdkf','ffgfgf','kklkjj',likeStatus.Like, 'gghhge')

    const allCollection = await ReactionModel.find({}).lean()

    //const allCollection = await helper.getReactionUserForParent("commentId","user.id")

    return res.send(allCollection).status(204)
})