import {Request, Response, Router} from "express";
import {
    loginUserValidation, postNewPassword, postRecoveryPassword, postRegistrationEmailResending,
    postRegistrConfirm,
    postUsersValidation,
} from "../Models/InputValidation";
import {authService} from "../domain/authService";
import {jwtService} from "../application/jwtService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {emailAdapters} from "../adapters/email-adapters";
import {createUser, findUserById, userRepository} from "../RepositoryInDB/user-repositoryDB";
import {getPaginationValuesAddNewUser} from "./user-router";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {randomUUID} from "crypto";
import {getPaginationValuesInputUserInformation} from "./securityDevices-route";
import {authAttemptLimit} from "../Middleware/authAttemptLimit";
import {RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";

export const authRouter=Router({})


//authMiddleware,
authRouter.post('/login', authAttemptLimit,loginUserValidation, async (req:Request, res:Response)=>{
    const {loginOrEmail, password} = req.body
    const user = await authService.login(loginOrEmail, password)
    if (!user) {
        return res.sendStatus(401);
    }
    if(!req.headers['user-agent']){
        req.headers['user-agent']='default'
    }
    const ipAddressInput=req.ip
    console.log('addressInput '+ipAddressInput)
    if(!ipAddressInput){
        return res.status(404).send('not found ipAddress')
    }
    let refreshToken=null;
    const paginationUserInformation=getPaginationValuesInputUserInformation(ipAddressInput,req.headers['user-agent'])
    const accessToken=await jwtService.createAccessTokenJWT(user.id)
    const checkTokenInBaseByName = await jwtService.checkTokenInBaseByName(user.id,paginationUserInformation.title)
    if(!checkTokenInBaseByName){
        const deviceId=randomUUID()
        refreshToken=await jwtService.createRefreshToken(user.id, deviceId)
        const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const diesAtDate = await jwtService.getDiesAtDate(refreshToken)
        await jwtService.createTokenByUserIdInBase(user.id,paginationUserInformation,deviceId,lastActiveDate,diesAtDate)
    }
    else {
        refreshToken = await jwtService.createRefreshToken(user.id, checkTokenInBaseByName)
        const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const diesAtDate = await jwtService.getDiesAtDate(refreshToken)
        await jwtService.updateTokenInBase(user.id, paginationUserInformation.title, lastActiveDate, diesAtDate)
    }
    const returnToken={
        accessToken: accessToken,
    }

    // /httpOnly:true,,secure: true
    return res.status(200)
        .cookie('refreshToken',refreshToken,
            {expires:new Date(Date.now() +20000),httpOnly:true,secure: true})
        .send(returnToken);
})

authRouter.post('/logout',authRefreshToken,async (req:Request, res:Response)=> {
        const refreshToken=req.cookies.refreshToken
    const userIdByOldRefreshToken=await jwtService.verifyToken(refreshToken)

    if(!userIdByOldRefreshToken){
        return res.status(401).send('controller logout')
    }

     const deleteDeviceUser=await jwtService.deleteTokenRealize(userIdByOldRefreshToken.userId,userIdByOldRefreshToken.deviceId)
    if(!deleteDeviceUser){
        return res.status(404).send('delete not successful')
    }
    return res.sendStatus(204)
})

authRouter.post('/refresh-token',authAttemptLimit,authRefreshToken,async (req:Request, res:Response)=>{
    const inputRefreshToken=req.cookies.refreshToken
    const userIdByOldRefreshToken=await jwtService.verifyToken(inputRefreshToken)

    if(!userIdByOldRefreshToken){
        return res.status(401).send('controller')
    }

    const accessToken=await jwtService.createAccessTokenJWT(userIdByOldRefreshToken.userId)
    const refreshToken=await jwtService.createRefreshToken(userIdByOldRefreshToken.userId,userIdByOldRefreshToken.deviceId)
    const lastActiveDate = await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
    console.log(lastActiveDate)
    const diesAtDate = await jwtService.getDiesAtDate(refreshToken)
    console.log(diesAtDate)
    const refreshTokenUpdate=await jwtService
        .refreshTokenInBase(userIdByOldRefreshToken.userId,userIdByOldRefreshToken.deviceId,lastActiveDate,diesAtDate)
    if(!refreshTokenUpdate){
        return res.send('no update RefreshToken')
    }
    console.log(refreshToken)
    const returnToken={
        accessToken: accessToken

        //httpOnly:true,, secure: true
    }
    return res.cookie('refreshToken',refreshToken,
        {expires:new Date(Date.now() +20000),httpOnly:true,secure: true})
        .status(200).send(returnToken);
})


authRouter.get('/me',authMiddleware,async (req:Request,res:Response)=>{
    return res.send({email:req.user!.email,login:req.user!.login,userId:req.user!.id})
})

authRouter.post('/registration',authAttemptLimit,postUsersValidation,async (req:Request,res:Response)=>{

    const paginationResult =getPaginationValuesAddNewUser(req.body)
    const resultNewUsers= await createUser(paginationResult)
    await UserModel.insertMany(resultNewUsers)

    try {
        await emailAdapters.gmailSendEmailRegistration(req.body.email, resultNewUsers.userConfirmationInfo.code)
    }
    catch (error) {
        console.error('email send out')
        await UserModel.deleteOne({id: resultNewUsers.id})
        return res.sendStatus(400)
    }
    return res.sendStatus(204)
})

authRouter.post('/registration-confirmation',authAttemptLimit,postRegistrConfirm,async (req:Request,res:Response)=> {

    return res.sendStatus(204)
})

authRouter.post('/registration-email-resending',authAttemptLimit,postRegistrationEmailResending,async (req:Request,res:Response)=> {
    const user=req.user
    if(!user){
         return res.sendStatus(400)
    }
    const refreshUserConfirmationCode=await authService.updateConfirmationCodeRepeat(user.id)
    if(!refreshUserConfirmationCode){
        return res.sendStatus(400)
    }
    try {
        await emailAdapters.gmailSendEmailRegistration(user.email, refreshUserConfirmationCode)
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

authRouter.post('/password-recovery',authAttemptLimit,postRecoveryPassword
    ,async(req:Request,res:Response)=>{
        const emailInput=req.body.email
        const recoveryCode= randomUUID()
        console.log('skolko vremia ne yasno')
        const expiredRecoveryCode:number=30000

    try {
        await emailAdapters.gmailSendEmailPasswordRecovery(emailInput, recoveryCode)
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


        const checkEmailAmongUser = await authService.checkEmail(emailInput)
        if(checkEmailAmongUser) {
            await  RecoveryPasswordModel.insertMany({
                recoveryCode:recoveryCode,
                userId:checkEmailAmongUser.id,
                diesAtDate:new Date(Date.now() +expiredRecoveryCode).toISOString()
            })

        }


    return res.sendStatus(204)

})

authRouter.post('/new-password',authAttemptLimit,postNewPassword,async (req:Request,res:Response)=>{
    const newPassword=req.body.newPassword
    const recoveryCode=req.body.recoveryCode
    const updatePassword=await userRepository.updatePasswordForUserbyRecovery(newPassword,recoveryCode)
    if(!updatePassword){
        return res.sendStatus(400)
    }
    return res.sendStatus(204)
})