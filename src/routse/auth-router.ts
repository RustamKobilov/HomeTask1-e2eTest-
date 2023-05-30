import {Router} from "express";
import {
    loginUserValidation,
    postNewPassword,
    postRecoveryPassword,
    postRegistrationEmailResending,
    postRegistrConfirm,
    postUsersValidation,
} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authRefreshToken} from "../Middleware/authRefreshToken";
import {authAttemptLimit} from "../Middleware/authAttemptLimit";
import { AuthContainer } from "../composition-root";
import { AuthController } from "../Controllers/auth-controller";


const authControllers = AuthContainer.resolve(AuthController)

export const authRouter=Router({})


authRouter.post('/login', authAttemptLimit,loginUserValidation,authControllers.loginUser.bind(authControllers))

authRouter.post('/refresh-token',authAttemptLimit,authRefreshToken, authControllers.updateRefreshToken.bind(authControllers))

authRouter.post('/logout',authRefreshToken, authControllers.logoutUser.bind(authControllers))

authRouter.get('/me',authMiddleware, authControllers.informationUser.bind(authControllers))

authRouter.post('/registration',authAttemptLimit,postUsersValidation, authControllers.registrationUser.bind(authControllers))

authRouter.post('/registration-confirmation',authAttemptLimit,postRegistrConfirm, authControllers.registrationConfirmationUser.bind(authControllers))

authRouter.post('/registration-email-resending',authAttemptLimit,postRegistrationEmailResending, authControllers.registrationEmailResendingUser.bind(authControllers))

authRouter.post('/password-recovery',authAttemptLimit,postRecoveryPassword, authControllers.passwordRecoveryUser.bind(authControllers))

authRouter.post('/new-password',authAttemptLimit,postNewPassword, authControllers.newPasswordUser.bind(authControllers))