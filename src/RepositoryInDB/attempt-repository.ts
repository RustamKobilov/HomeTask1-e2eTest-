import {SecurityOfAttemptsType} from "../routse/devices-route";
import {AttemptModel} from "../Models/shemaAndModel";


class AttemptRepository{
    async createAttempt(attempt:SecurityOfAttemptsType){
        await AttemptModel
            .insertMany({endPointName:attempt.endPointName, ip:attempt.ip, dateAttempt:attempt.dateAttempt})
        return
    }
    async getCountAttemptIpForEndPoint(attempt:SecurityOfAttemptsType):Promise<number>{
       const getAttempt= await AttemptModel
            .countDocuments({endPointName:attempt.endPointName, ip:attempt.ip,dateAttempt:{$gte:attempt.dateAttempt}})
    return getAttempt
    }
}

export const attemptRepository= new AttemptRepository()