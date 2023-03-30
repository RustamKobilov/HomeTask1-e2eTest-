import {Request, Response, Router} from "express";
import nodemailer from 'nodemailer'
import {
    errorMessagesInputValidation,
    loginUserValidation, postRegistrationEmailResending,
    postRegistrConfirm,
    postUsersValidation,
} from "../Models/InputValidation";
import {authService} from "../domain/authService";
import {jwtService} from "../application/jwtService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {emailAdapters} from "../adapters/email-adapters";
import {createUser, findUserById, userRepository} from "../RepositoryInDB/user-repositoryDB";
import {tokensCollection, usersCollection} from "../db";
import {getPaginationValuesAddNewUser} from "./user-router";
import {authRefreshToken} from "../Middleware/authRefreshToken";

export const authRouter=Router({})

//authMiddleware,
authRouter.post('/login', loginUserValidation,async (req:Request, res:Response)=>{
    const {loginOrEmail, password} = req.body
    const user = await authService.login(loginOrEmail, password)
    if (!user) {
        return res.sendStatus(401);
    }
    const accessToken=await jwtService.createTokenJWT(user.id,'access')
    const refreshToken=await jwtService.createTokenJWT(user.id,'refresh')

    await tokensCollection.insertOne({
        id:user.id,
        refreshToken:refreshToken
    })

    const returnToken={
        accessToken: accessToken
    }
    return res.cookie('refreshToken',refreshToken,
        {httpOnly:true,expires:new Date(Date.now() +20000), secure: true}, ).send(returnToken).status(200);
})

authRouter.post('/logout',authRefreshToken,async (req:Request, res:Response)=> {
        const refreshToken=req.body.refreshToken
        await jwtService.deleteTokenRealize(refreshToken)

    return res.sendStatus(204)
})

authRouter.post('/refresh-token',authRefreshToken,async (req:Request, res:Response)=>{
    const inputRefreshToken=req.cookies.refreshToken

    const userIdByOldRefreshToken=await jwtService.verifyToken(inputRefreshToken)
    if(!userIdByOldRefreshToken){
        return res.sendStatus(401)
    }
    const accessToken=await jwtService.createTokenJWT(userIdByOldRefreshToken,'access')
    const refreshToken=await jwtService.createTokenJWT(userIdByOldRefreshToken,'refresh')

    await jwtService.refreshTokenRealize(userIdByOldRefreshToken,refreshToken)

    const returnToken={
        accessToken: accessToken
    }
    return res.cookie('refreshToken',refreshToken,
        {httpOnly:true,expires:new Date(Date.now() +20000)}).send(returnToken).status(200);

})


authRouter.get('/me',authMiddleware,async (req:Request,res:Response)=>{
    return res.send({email:req.user!.email,login:req.user!.login,userId:req.user!.id})
})

authRouter.post('/registration',postUsersValidation,async (req:Request,res:Response)=>{

    const paginationResult =getPaginationValuesAddNewUser(req.body)
    const resultNewUsers= await createUser(paginationResult)
    await usersCollection.insertOne(resultNewUsers)

    try {
        await emailAdapters.gmailAdapter(req.body.email, resultNewUsers.userConfirmationInfo.code)
    }
    catch (error) {
        console.error('email send out')
        await usersCollection.deleteOne({id: resultNewUsers.id})
        return res.sendStatus(400)
    }
    return res.sendStatus(204)
})

authRouter.post('/registration-confirmation',postRegistrConfirm,async (req:Request,res:Response)=> {

    return res.sendStatus(204)
})

authRouter.post('/registration-email-resending',postRegistrationEmailResending,async (req:Request,res:Response)=> {
    const user=req.user
    if(!user){
         return res.sendStatus(400)
    }
    const refreshUserConfirmationCode=await authService.updateConfirmationCodeRepeat(user.id)
    if(!refreshUserConfirmationCode){
        return res.sendStatus(400)
    }
    try {
        await emailAdapters.gmailAdapter(user.email, refreshUserConfirmationCode)
    }
    catch (error) {
        console.error('email send out')
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "email invalid",
                    "field": "email"
                }
            ]
        })
    }

    return res.sendStatus(204)
})