import {findUserById, userRepository, UserType} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";
import {jwtService} from "../application/jwtService";

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<false|UserType> {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user){return false}
        console.log(user.hash)
        console.log(password)
        const resultCompare=await bcrypt.compare(password, user.hash)
        console.log(resultCompare)
        if(!resultCompare){return false}
    return user
    }
}