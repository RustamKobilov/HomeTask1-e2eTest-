import {AttemptModel, IAttemptLoginEndPoint} from "../Models/shemaAndModel";



class AttemptRepository{
    async createAttempt(attempt:IAttemptLoginEndPoint){
        await AttemptModel
            .insertMany({endpointName:attempt.endpointName, ip:attempt.ip, dateAttempt:attempt.dateAttempt})
        return
    }
    async getCountAttemptIpForEndPoint(attempt:IAttemptLoginEndPoint):Promise<number>{
       const getAttempt= await AttemptModel
            .countDocuments({endPointName:attempt.endpointName, ip:attempt.ip,dateAttempt:{$gte:attempt.dateAttempt}})
    return getAttempt
    }
}

export const attemptRepository= new AttemptRepository()