import * as dotenv from 'dotenv'
dotenv.config()
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";

export const jwtService= {
    async createTokenJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_Service, {expiresIn: '1h'})
        return token

    },
    async checkToken(token: string) {
        try {
            const resultVerify: any = jwt.verify(token, settings.JWT_Service)
            return resultVerify.userId
        } catch (errors) {
            return null
        }
    }
}