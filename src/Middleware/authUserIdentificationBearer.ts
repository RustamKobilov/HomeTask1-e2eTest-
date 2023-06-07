import {JwtService} from "../application/jwtService";
import {Request, Response, NextFunction} from "express";
import {userRepository} from "../RepositoryInDB/user-repositoryDB";

export const authUserIdentificationBearer = async (req: Request, res: Response, next: NextFunction) => {
    const inputToken = req.headers.authorization;
    if (!inputToken) {
        req.user = null
        next()
        return;
    }

    const jwtService = new JwtService()
    const token = inputToken.split(' ')[1]
    const resultSearchUserIdbyToken = await jwtService.verifyToken(token)
    if (!resultSearchUserIdbyToken) {
        req.user = null
        next()
        return;
    }

    const user = await userRepository.findUserById(resultSearchUserIdbyToken.userId)
    if (!user) {
        req.user = null
        next()
        return;
    }

    req.user = user
    next()
    return;

}