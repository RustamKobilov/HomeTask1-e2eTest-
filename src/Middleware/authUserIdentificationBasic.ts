import {NextFunction, Request, Response} from "express";


export const authUserIdentificationBasic= (req: Request, res:Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401)

    const authType = auth.split(' ')[0]
    if(authType !== 'Basic'){
        next()
    return
    }
    const payload = auth.split(' ')[1]
    if (!payload){
        next()
        return
    }
    const decodedPayload = Buffer.from(payload, 'base64').toString()
    if (!decodedPayload) {
        next()
        return
    }

    const login = decodedPayload.split(':')[0]
    const password = decodedPayload.split(':')[1]
    if (login !== 'admin' || password !== 'qwerty'){
        next()
        return
    }

    //req.user = user
    next()
    return;
}