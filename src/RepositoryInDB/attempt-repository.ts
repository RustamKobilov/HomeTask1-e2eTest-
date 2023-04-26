import {SecurityOfAttemptsType} from "../routse/securityDevices-route";
import {inspect} from "util";
import {securityAttemptsEndpoints} from "../db";
import {CountDocumentsOptions} from "mongodb";

export const attemptRepository={
    async createAttempt(attempt:SecurityOfAttemptsType){
        await securityAttemptsEndpoints
            .insertOne({endPointName:attempt.endPointName, ip:attempt.ip, dateAttempt:attempt.dateAttempt})
        return
    },
    async getCountAttemptIpForEndPoint(attempt:SecurityOfAttemptsType):Promise<number>{
       const getAttempt= await securityAttemptsEndpoints
            .countDocuments({endPointName:attempt.endPointName, ip:attempt.ip,dateAttempt:{$gte:attempt.dateAttempt}})
    return getAttempt
    }
}