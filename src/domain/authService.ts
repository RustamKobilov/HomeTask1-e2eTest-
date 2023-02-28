import {findUserById, userRepository, UserType} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";
import {jwtService} from "../application/jwtService";

export const authService = {

    //  async authUser():Promise<UserType>{
    //      const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
    //      if(!user){return false}
    //      const resultUCompareDateUser=bcrypt.compare(password, user.hash)
    //      if(!resultUCompareDateUser){return false}
    // },
    async login(loginOrEmail: string, password: string): Promise<false|UserType> {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user){return false}
        const resultCompare=bcrypt.compare(password, user.hash)
        if(!resultCompare){return false}
    return user
    }
}