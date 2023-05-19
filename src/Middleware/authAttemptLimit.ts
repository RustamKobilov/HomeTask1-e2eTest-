import {NextFunction, Request, Response} from "express";
import {attemptRepository} from "../RepositoryInDB/attempt-repository";
import {SecurityOfAttemptsType} from "../Controllers/device-controller";

export const authAttemptLimit=async (req: Request, res: Response, next: NextFunction)=>{
    const {ip,url}=req
    if(!ip&&!url){
        return res.status(404).send('authLimitAttempt bad ip ')
    }
    const lastAttempt=new Date(Date.now() +10000).toISOString()
    const attemptIpForEndpoint:SecurityOfAttemptsType={endPointName:url, ip:ip, dateAttempt:lastAttempt}
    await attemptRepository.createAttempt(attemptIpForEndpoint)
    const limit:number=5
    const resultCheckAttempt=await attemptRepository.getCountAttemptIpForEndPoint({endPointName:url, ip:ip, dateAttempt:new Date().toISOString()})
    if(resultCheckAttempt>limit){
        return res.status(429).send('ne nado tak chasto')
    }

    next()
    return;
}