import {Request, Response, Router} from "express";

import {searchDateVerificationUserLoginAndEmail} from "../RepositoryInDB/user-repositoryDB";
import {loginUserValidation} from "../Models/InputValidation";
import {authService} from "../domain/authService";

export const authRouter=Router({})


authRouter.post('/login', loginUserValidation,async (req:Request, res:Response)=>{
    const {loginOrEmail, password} = req.body
    const resultAuth = await authService.login(loginOrEmail, password)
    if (!resultAuth) {
        return res.sendStatus(401);
    }
    return res.sendStatus(204);
})