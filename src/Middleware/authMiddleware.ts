import {jwtService} from "../application/jwtService";
import {Request,Response,NextFunction} from "express";
import {userRepository} from "../RepositoryInDB/user-repositoryDB";

export const authMiddleware =async (req: Request, res: Response, next: NextFunction) => {
    const inputToken = req.headers.authorization;
    if (!inputToken) return res.sendStatus(401)

    const token = inputToken.split(' ')[1]
    const resultSearchUserIdbyToken = await jwtService.verifyToken(token)
    if (resultSearchUserIdbyToken) {
        const user=await userRepository.findUserById(resultSearchUserIdbyToken.userId)
        if (user) {
            req.user = user
            next()
            return;
        }
    }

    return res.sendStatus(401)
}