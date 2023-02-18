import {findUserById, userRepository} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";

export const authService = {

    async login(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        return bcrypt.compare(password, user.hash)
    }
}