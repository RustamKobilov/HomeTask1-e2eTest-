import * as dotenv from 'dotenv'
dotenv.config()
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {tokensCollection} from "../db";

export type RefreshToken={
    id:string,
    refreshToken:string
}

export const jwtService= {
    async createTokenJWT(userId: string,tokenType:string) {
            let token = jwt.sign({userId: userId}, settings.JWT_Service, {expiresIn: '10s'})
        if(tokenType=='access'){
            token=jwt.sign({userId: userId}, settings.JWT_Service, {expiresIn: '20s'})
        }
        return token

    },
    async verifyToken(token: string) {
        try {
            const resultVerify: any = jwt.verify(token, settings.JWT_Service)
            console.log(resultVerify)
            return resultVerify.userId
        } catch (errors) {
            return null
        }
    },
    async checkTokenInBase(userId: string,refreshToken:string) {
        const resultCheckToken=await tokensCollection.findOne({id:userId,refreshToken:refreshToken})
        if(!resultCheckToken){
            return false
        }
        return true
    },
    async refreshTokenRealize(id:string,refreshToken:string){

        const tokenUpdate=await tokensCollection.updateOne({id:id},{
            $set: {
                token: refreshToken
            }
        })
        return tokenUpdate.matchedCount === 1
    },
    async deleteTokenRealize(refreshToken:string){
        const deleteToken=await tokensCollection.deleteOne({refreshToken:refreshToken})
        if(!deleteToken){
            return false
        }
        return true
    }
}