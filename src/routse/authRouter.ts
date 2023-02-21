import {Request, Response, Router} from "express";

import {loginUserValidation} from "../Models/InputValidation";
import {authService} from "../domain/authService";
import {jwtService} from "../application/jwtService";

export const authRouter=Router({})


authRouter.post('/login', loginUserValidation,async (req:Request, res:Response)=>{
    const {loginOrEmail, password} = req.body
    const resultAuth = await authService.login(loginOrEmail, password)
    if (!resultAuth) {
        return res.sendStatus(401);
    }
    const token=jwtService.createTokenJWT(resultAuth)
    return res.status(201).send(token);
})