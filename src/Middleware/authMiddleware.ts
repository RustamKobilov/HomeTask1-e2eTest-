import {jwtService} from "../application/jwtService";
import {Request,Response,NextFunction} from "express";
import {findUserById} from "../RepositoryInDB/user-repositoryDB";

export const authMiddleware =async (req: Request, res: Response, next: NextFunction) => {
    const inputToken = req.headers.authorization;
    if (!inputToken) return res.sendStatus(401)

    const token = inputToken.split(' ')[1]

    const resultSearchUserIdbyToken = await jwtService.checkToken(token)
    //console.log(resultSearchUserIdbyToken)
    if (resultSearchUserIdbyToken) {
        const user=await findUserById(resultSearchUserIdbyToken)
        console.log(user)
        if (user) {
            req.user = user
            next()
            return;
        }
    }

    return res.sendStatus(401)
}