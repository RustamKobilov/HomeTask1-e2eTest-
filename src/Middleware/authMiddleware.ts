import {JwtService} from "../application/jwtService";
import {Request, Response, NextFunction} from "express";
import {userRepository} from "../RepositoryInDB/user-repositoryDB";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const inputToken = req.headers.authorization;
    if (!inputToken) return res.sendStatus(401)

    const jwtService = new JwtService()
    const token = inputToken.split(' ')[1]
    const resultSearchUserIdbyToken = await jwtService.verifyToken(token)
    if (!resultSearchUserIdbyToken) return res.sendStatus(401)

    const user = await userRepository.findUserById(resultSearchUserIdbyToken.userId)
    if (!user) return res.sendStatus(401)

    req.user = user
    next()
    return;

}