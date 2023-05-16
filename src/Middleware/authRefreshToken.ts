import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwtService";


export const authRefreshToken =async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken=req.cookies.refreshToken
    const jwtService = new JwtService()
    const resultVerifyToken=await jwtService.verifyToken(refreshToken)
    if(!resultVerifyToken){
        return res.status(401).send('dont verify authRefreshMiddleware' + refreshToken)
    }
    const lastActiveDate=await jwtService.getLastActiveDateFromRefreshToken(refreshToken)
    const resultCheckTokenInBase=await jwtService
        .checkTokenInBase(resultVerifyToken.userId,resultVerifyToken.deviceId,lastActiveDate)

    if(!resultCheckTokenInBase){
        return res.status(401).send('base tyt ' + resultVerifyToken.userId+' '+resultVerifyToken.deviceId + ' ' +lastActiveDate)
    }

    next()
    return;
}