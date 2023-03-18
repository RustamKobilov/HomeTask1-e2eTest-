import {findUserById, userRepository, UserType} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";
import {jwtService} from "../application/jwtService";
import {blogsCollection} from "../db";
import {randomUUID} from "crypto";

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<false|UserType> {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user){return false}
        const resultCompare=await bcrypt.compare(password, user.hash)
        if(!resultCompare){return false}
        if(user.userConfirmationInfo.userConformation==false){return false}
        return user
    },
    async checkConfirmationCode(code:string){
        const resultSearchCodeInUser=await userRepository.findUserByCode(code)
        if(!resultSearchCodeInUser){
            return false
        }
        if(resultSearchCodeInUser.userConfirmationInfo.userConformation==true){return false}
        const dateNow=new Date(new Date().getTime())
        const dateCode=new Date(new Date(resultSearchCodeInUser.userConfirmationInfo.expirationCode).getTime())

        if(dateCode<dateNow){
            return false
        }
        console.log('typoi')
        console.log(resultSearchCodeInUser)

        await userRepository.updateUserConformation(resultSearchCodeInUser.id)
        return true
    },
    async checkEmail(email:string):Promise<false|UserType>{
        const resultSearchEmail=await userRepository.findUserByEmail(email)

        if(!resultSearchEmail){
            return false
        }
        return resultSearchEmail
    },
    async checkLogin(login:string):Promise<false|UserType>{
        const resultSearchLogin=await userRepository.findUserByLogin(login)
        if(!resultSearchLogin){
            return false
        }
        return resultSearchLogin
    },
    async updateConfirmationCodeRepeat(id:string):Promise<string|false>{
        const newCode=randomUUID()
        const resultUpdateCode=await userRepository.updateUserConformationCode(id,newCode)
        if(!resultUpdateCode){
            return false
        }
        return newCode
    }
}