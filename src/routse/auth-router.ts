import {Request, Response, Router} from "express";
import {
    loginUserValidation, postNewPassword, postRecoveryPassword, postRegistrationEmailResending,
    postRegistrConfirm,
    postUsersValidation,
} from "../Models/InputValidation";
import {authService} from "../domain/authService";
import {JwtService} from "../application/jwtService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {emailAdapters} from "../adapters/email-adapters";
import {getPaginationValuesAddNewUser} from "./users-router";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {randomUUID} from "crypto";
import {getPaginationValuesInputUserInformation} from "./devices-route";
import {authAttemptLimit} from "../Middleware/authAttemptLimit";
import {UserService} from "../Service/userService";
import {authControllers} from "../composition-root";

export const authRouter=Router({})

export class AuthController{
    constructor(protected userService : UserService, protected jwtService : JwtService) {}

        async loginUser(req: Request, res: Response) {
        const {loginOrEmail, password} = req.body
        const user = await authService.login(loginOrEmail, password)
        if (!user) {
            return res.sendStatus(401);
        }
        if (!req.headers['user-agent']) {
            req.headers['user-agent'] = 'default'
        }
        const ipAddressInput = req.ip
        if (!ipAddressInput) {
            return res.status(404).send('not found ipAddress')
        }

        let refreshToken = null;
        const paginationUserInformation = getPaginationValuesInputUserInformation(ipAddressInput, req.headers['user-agent'])
        const accessToken = await this.jwtService.createAccessTokenJWT(user.id)
        const checkTokenInBaseByName = await this.jwtService.checkTokenInBaseByName(user.id, paginationUserInformation.title)
        if (!checkTokenInBaseByName) {
            const deviceId = randomUUID()
            refreshToken = await this.jwtService.createRefreshToken(user.id, deviceId)
            const lastActiveDate = await this.jwtService.getLastActiveDateFromRefreshToken(refreshToken)
            const diesAtDate = await this.jwtService.getDiesAtDate(refreshToken)
            await this.jwtService.createTokenByUserIdInBase(user.id, paginationUserInformation, deviceId, lastActiveDate, diesAtDate)
        } else {
            refreshToken = await this.jwtService.createRefreshToken(user.id, checkTokenInBaseByName)
            const lastActiveDate = await this.jwtService.getLastActiveDateFromRefreshToken(refreshToken)
            const diesAtDate = await this.jwtService.getDiesAtDate(refreshToken)
            await this.jwtService.updateTokenInBase(user.id, paginationUserInformation.title, lastActiveDate, diesAtDate)
        }
        const returnToken = {
            accessToken: accessToken,
        }

// /httpOnly:true,,secure: true
        return res.status(200)
            .cookie('refreshToken', refreshToken,
                {expires: new Date(Date.now() + 20000), httpOnly: true, secure: true})
            .send(returnToken);
    }

    async updateRefreshToken(req: Request, res: Response) {
        const inputRefreshToken = req.cookies.refreshToken
        const userIdByOldRefreshToken = await this.jwtService.verifyToken(inputRefreshToken)

        if (!userIdByOldRefreshToken) {
            return res.status(401).send('controller')
        }

        const accessToken = await this.jwtService.createAccessTokenJWT(userIdByOldRefreshToken.userId)
        const refreshToken = await this.jwtService.createRefreshToken(userIdByOldRefreshToken.userId, userIdByOldRefreshToken.deviceId)
        const lastActiveDate = await this.jwtService.getLastActiveDateFromRefreshToken(refreshToken)
        const diesAtDate = await this.jwtService.getDiesAtDate(refreshToken)
        const refreshTokenUpdate = await this.jwtService
            .refreshTokenInBase(
                userIdByOldRefreshToken.userId,
                userIdByOldRefreshToken.deviceId,
                lastActiveDate,
                diesAtDate
            )
        if (!refreshTokenUpdate) {
            return res.send('no update RefreshToken')
        }

        const returnToken = {
            accessToken: accessToken

            //httpOnly:true,, secure: true
        }
        return res.cookie('refreshToken', refreshToken,
            {expires: new Date(Date.now() + 20000), httpOnly: true, secure: true})
            .status(200).send(returnToken);
    }

    async logoutUser(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const userIdByOldRefreshToken = await this.jwtService.verifyToken(refreshToken)

        if (!userIdByOldRefreshToken) {
            return res.status(401).send('controller logout')
        }

        const deleteDeviceUser = await this.jwtService.deleteTokenRealize(userIdByOldRefreshToken.userId, userIdByOldRefreshToken.deviceId)
        if (!deleteDeviceUser) {
            return res.status(404).send('delete not successful')
        }
        return res.sendStatus(204)
    }
    async informationUser(req:Request,res:Response){
    return res.send({email:req.user!.email,login:req.user!.login,userId:req.user!.id})
    }
    async registrationUser(req: Request, res: Response) {

        const paginationResult = getPaginationValuesAddNewUser(req.body)
        const resultNewUsers = await this.userService.createUserRegistration(paginationResult)

        try {
            await emailAdapters.gmailSendEmailRegistration(req.body.email, resultNewUsers.userConfirmationInfo.code)
        } catch (error) {
            console.error('email send out')
            await this.userService.deleteUserById(resultNewUsers.id)
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    }
    async registrationConfirmationUser(req: Request, res: Response) {

        return res.sendStatus(204)
    }
    async registrationEmailResendingUser(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            return res.sendStatus(400)
        }
        const refreshUserConfirmationCode = await authService.updateConfirmationCodeRepeat(user.id)
        if (!refreshUserConfirmationCode) {
            return res.sendStatus(400)
        }
        try {
            await emailAdapters.gmailSendEmailRegistration(user.email, refreshUserConfirmationCode)
        } catch (error) {
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
    }
    async passwordRecoveryUser(req: Request, res: Response) {
        const emailInput = req.body.email
        let recoveryCode = randomUUID()
        const expiredRecoveryCode: number = 30000//why comment?

        const checkEmailAmongUser = await authService.checkEmail(emailInput)

        if (checkEmailAmongUser) {
            console.log('email yes')
            await this.userService.createRecoveryPasswordUserItem({
                recoveryCode: recoveryCode,
                userId: checkEmailAmongUser.id,
                diesAtDate: new Date(Date.now() + expiredRecoveryCode).toISOString()
            })
        }


        try {
            await emailAdapters.gmailSendEmailPasswordRecovery(emailInput, recoveryCode)
        } catch (error) {
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

}
    async newPasswordUser(req: Request, res: Response) {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        const updatePassword = await this.userService.
        updatePasswordForUserByRecovery(newPassword, recoveryCode)
        if (!updatePassword) {
            return res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "update password invalid",
                        "field": "password"
                    }
                ]
            })
        }
        return res.sendStatus(204)
    }
}


authRouter.post('/login', authAttemptLimit,loginUserValidation,authControllers.loginUser.bind(authControllers))

authRouter.post('/refresh-token',authAttemptLimit,authRefreshToken, authControllers.updateRefreshToken.bind(authControllers))

authRouter.post('/logout',authRefreshToken, authControllers.logoutUser.bind(authControllers))

authRouter.get('/me',authMiddleware, authControllers.informationUser.bind(authControllers))

authRouter.post('/registration',authAttemptLimit,postUsersValidation, authControllers.registrationUser.bind(authControllers))

authRouter.post('/registration-confirmation',authAttemptLimit,postRegistrConfirm, authControllers.registrationConfirmationUser.bind(authControllers))

authRouter.post('/registration-email-resending',authAttemptLimit,postRegistrationEmailResending, authControllers.registrationEmailResendingUser.bind(authControllers))

authRouter.post('/password-recovery',authAttemptLimit,postRecoveryPassword, authControllers.passwordRecoveryUser.bind(authControllers))

authRouter.post('/new-password',authAttemptLimit,postNewPassword, authControllers.newPasswordUser.bind(authControllers))