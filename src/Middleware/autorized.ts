import {NextFunction, Request, Response} from "express";


export const basicAuthMiddleware = (req: Request, res:Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401)

    const authType = auth.split(' ')[0]
    if(authType !== 'Basic') return res.sendStatus(401)

    const payload = auth.split(' ')[1]
    if (!payload) return res.sendStatus(401)

    const decodedPayload = Buffer.from(payload, 'base64').toString()
    if (!decodedPayload) return res.sendStatus(401)

    const login = decodedPayload.split(':')[0]
    const password = decodedPayload.split(':')[1]
    if (login !== 'admin' || password !== 'qwerty'){
        return res.sendStatus(401)
    }
    return next();
}