import * as dotenv from 'dotenv'
dotenv.config()
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import jwt from 'jsonwebtoken'

const JWT_Service=process.env.JWT_SERVICE||'112233'
export const jwtService={
    async createTokenJWT(user:UserType){
        const token =jwt.sign({userId:user.id},JWT_Service,{expiresIn:'1h'})
        return token
    }
}