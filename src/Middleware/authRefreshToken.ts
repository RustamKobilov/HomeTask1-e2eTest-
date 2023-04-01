import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";


export const authRefreshToken =async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken=req.cookies.refreshToken
    // console.log(refreshToken)
    // console.log(req.cookies)
    const resultVerifyToken=await jwtService.verifyToken(refreshToken)
    if(!resultVerifyToken){
        return res.status(401).send('verify')
    }
    const resultCheckTokenInBase=await jwtService.checkTokenInBase(resultVerifyToken,refreshToken)
    if(!resultCheckTokenInBase){
        return res.status(401).send('base')
    }

    next()
    return;
}