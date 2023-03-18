import {Request, Response, Router} from "express";
import nodemailer from 'nodemailer'
import {
    errorMessagesInputValidation,
    loginUserValidation, postRegistrationEmailResending,
    postRegistrConfirm,
    postUsersValidation
} from "../Models/InputValidation";
import {authService} from "../domain/authService";
import {jwtService} from "../application/jwtService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {emailAdapters} from "../adapters/email-adapters";
import {createUser, findUserById, userRepository} from "../RepositoryInDB/user-repositoryDB";
import {usersCollection} from "../db";
import {getPaginationValuesAddNewUser} from "./user-router";

export const authRouter=Router({})

//authMiddleware,
authRouter.post('/login', loginUserValidation,async (req:Request, res:Response)=>{
    const {loginOrEmail, password} = req.body
    const user = await authService.login(loginOrEmail, password)
    if (!user) {
        return res.sendStatus(401);
    }
    const token=await jwtService.createTokenJWT(user)
    const returnToken={
        accessToken: token
    }
    return res.status(200).send(returnToken);
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
    const inputEmail=req.body.email
    const resultSearchEmail=await authService.checkEmail(inputEmail)
    if(!resultSearchEmail){
        return res.sendStatus(400)
    }
    const refreshUserConfirmationCode=await authService.updateConfirmationCodeRepeat(resultSearchEmail.id)
    if(!refreshUserConfirmationCode){
        return res.sendStatus(400)
    }
    try {
        await emailAdapters.gmailAdapter(inputEmail, refreshUserConfirmationCode)
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