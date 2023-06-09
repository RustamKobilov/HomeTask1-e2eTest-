import {NextFunction, Request, Response} from "express";
import {attemptRepository} from "../RepositoryInDB/attempt-repository";
import {IAttemptLoginEndPoint} from "../Models/shemaAndModel";

export const authAttemptLimit=async (req: Request, res: Response, next: NextFunction)=>{
    const {ip,url}=req
    if(!ip&&!url){
        return res.status(404).send('authLimitAttempt bad ip ')
    }
    const lastAttempt=new Date(Date.now() +10000).toISOString()
    const attemptIpForEndpoint:IAttemptLoginEndPoint={endpointName:url, ip:ip, dateAttempt:lastAttempt}
    await attemptRepository.createAttempt(attemptIpForEndpoint)
    const limit:number=5
    const resultCheckAttempt=await attemptRepository.getCountAttemptIpForEndPoint({endpointName:url, ip:ip, dateAttempt:new Date().toISOString()})
    console.log(lastAttempt)
    console.log(new Date().toISOString())
    console.log(attemptIpForEndpoint)
    console.log(resultCheckAttempt)
    if(resultCheckAttempt>limit){
        return res.status(429).send('ne nado tak chasto')
    }

    next()
    return;
}