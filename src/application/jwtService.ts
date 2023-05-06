import * as dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {UserInformationType} from "../routse/securityDevices-route";
import {DeviceModel} from "../Models/shemaAndModel";


export type ActiveSessionsType ={
    userId:string,
    lastActiveDate:string,
    diesAtDate:string,
    deviceId:string,
    title:string,
    ip:string
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
        const resultCheckToken=await DeviceModel.findOne({userId:userId,deviceId:deviceId,lastActiveDate:lastActiveDate})
        if(!resultCheckToken){
            return false
        }
        return true
    },
    async checkTokenInBaseByName(userId: string, title:string):Promise<string|false>{
        const resultCheckToken = await DeviceModel.findOne({userId: userId, title: title})
        if (!resultCheckToken) {
            return false
        }
        return resultCheckToken.deviceId
    },
    async createTokenByUserIdInBase(userId: string,
                                    paginationUserInformation:UserInformationType,
                                    deviceId:string, lastActiveDate:string,diesAtDate:string) {


            await DeviceModel.insertMany({
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate,
                deviceId:deviceId,
                title:paginationUserInformation.title,
                ip:paginationUserInformation.ipAddress,
                userId:userId
            })

    },
    async updateTokenInBase(userId:string, title:string, lastActiveDate:string, diesAtDate:string){

        const tokenUpdate=await DeviceModel.
        updateOne({userId:userId,title: title },{
            $set: {
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate
            }
        })
        return tokenUpdate.matchedCount === 1
    },
    async refreshTokenInBase(userId:string, deviceId:string, lastActiveDate:string, diesAtDate:string){
        const tokenUpdate=await DeviceModel.
        updateOne({userId:userId,deviceId:deviceId},{
            $set: {
                lastActiveDate:lastActiveDate,
                diesAtDate:diesAtDate
            }
        })
        return tokenUpdate.matchedCount === 1
    },
    async deleteTokenRealize(userId:string,deviceId:string){
        const deleteToken=await DeviceModel.deleteOne({userId:userId,deviceId:deviceId})
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