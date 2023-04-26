import * as dotenv from 'dotenv'
dotenv.config()
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {sessionsTypeCollection} from "../db";
import {randomUUID} from "crypto";
import {UserInformationType} from "../routse/securityDevices-route";


export type ActiveSessionsType ={
    userId:string,
    lastActiveDate:string,
    diesAtDate:string,
    deviceId:string,
    deviceName:string,
    ip:string,
}

export const jwtService= {
    async createAccessTokenJWT(userId: string) {
            let accessToken = jwt.sign({userId: userId}, settings.JWT_Service, {expiresIn: '10s'})
        return accessToken
    },
    async createRefreshToken(userId: string,deviceId:string){
        const refreshToken= jwt.sign({userId: userId,deviceId:deviceId}, settings.JWT_Service, {expiresIn: '20s'})
    return refreshToken
    },
    async verifyToken(token: string) {
        try {
            const resultVerify: any = jwt.verify(token, settings.JWT_Service)
            console.log(resultVerify + 'result verify token')
            console.log(token)
            return resultVerify
        } catch (errors) {
            return null
        }
    },
    async checkTokenInBase(userId: string,deviceId:string,lastActiveDate:string){
        const resultCheckToken=await sessionsTypeCollection.findOne({userId:userId,deviceId:deviceId,lastActiveDate:lastActiveDate})
        if(!resultCheckToken){
            return false
        }
        return true
    },
    async checkTokenInBaseByName(userId: string,deviceName:string):Promise<string|false>{
        const resultCheckToken = await sessionsTypeCollection.findOne({userId: userId, deviceName: deviceName})
        if (!resultCheckToken) {
            return false
        }
        return resultCheckToken.deviceId
    },
    async createTokenByUserIdInBase(userId: string,
                                    paginationUserInformation:UserInformationType,
                                    deviceId:string, lastActiveDate:string,diesAtDate:string) {

        // const resultCheckToken=await sessionsTypeCollection
        //     .findOne({userId:userId,deviceName:paginationUserInformation.deviceName})
        // if(!resultCheckToken){


            await sessionsTypeCollection.insertOne({
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate,
                deviceId:deviceId,
                deviceName:paginationUserInformation.deviceName,
                ip:paginationUserInformation.ipAddress,
                userId:userId
            })
        // } else {
        //
        // }
    },
    async updateTokenInBase(userId:string, deviceName:string, lastActiveDate:string, diesAtDate:string){

        const tokenUpdate=await sessionsTypeCollection.
        updateOne({userId:userId,deviceName:deviceName},{
            $set: {
               // deviceId:deviceId,
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate
            }
        })
        return tokenUpdate.matchedCount === 1
    },
    async refreshTokenInBase(userId:string, deviceId:string, lastActiveDate:string, diesAtDate:string){
        const tokenUpdate=await sessionsTypeCollection.
        updateOne({userId:userId,deviceId:deviceId},{
            $set: {
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate
            }
        })
        return tokenUpdate.matchedCount === 1
    },
    async deleteTokenRealize(userId:string,deviceId:string){
        const deleteToken=await sessionsTypeCollection.deleteOne({userId:userId,deviceId:deviceId})
        if(!deleteToken){
            return false
        }
        return true
    },
    async getLastActiveDateFromRefreshToken(refreshToken: string) {
        const payload:any = jwt.decode(refreshToken)
        return new Date(payload.iat * 1000).toISOString()
    },
    async getDiesAtDate(refreshToken: string){
        const payload:any = jwt.decode(refreshToken)
        return new Date(payload.exp * 1000).toISOString()
    }
}