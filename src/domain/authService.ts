import {findUserById, userRepository, UserType} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";
import {jwtService} from "../application/jwtService";
import {blogsCollection} from "../db";

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
        const dateNow=new Date(new Date().getTime())
        const dateCode=new Date(new Date(resultSearchCodeInUser.userConfirmationInfo.expirationCode).getTime())

        if(dateCode<dateNow){
            return false
        }
        await userRepository.updateUserConformation(resultSearchCodeInUser.id)
        return true
    },
    async checkEmail(email:string):Promise<false|UserType>{
        const resultSearchEmail=await userRepository.findUserByEmail(email)

        if(!resultSearchEmail){
            return false
        }
        return resultSearchEmail
    }

}