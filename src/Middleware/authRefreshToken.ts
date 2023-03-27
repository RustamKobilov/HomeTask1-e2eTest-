import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";

export const authRefreshToken =async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken=req.cookies.refreshToken
    console.log(refreshToken)
    const resultVerifyToken=await jwtService.verifyToken(refreshToken)
    if(!resultVerifyToken){
        return res.sendStatus(401)
    }
    const resultCheckTokenInBase=await jwtService.checkTokenInBase(resultVerifyToken,refreshToken)
    if(!resultCheckTokenInBase){
        return res.sendStatus(401)
    }

    next()
    return;
}