import {jwtService} from "../application/jwtService";
import {authService} from "../domain/authService";

export const authMiddleware =(req:Request,res:Response,next: NextFunction)=>{
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401)

    const token=auth.split('')[1]

    const userId=await jwtService.checkToken(token)
    if(userId){
        req.user =await jwtService.
    }
}