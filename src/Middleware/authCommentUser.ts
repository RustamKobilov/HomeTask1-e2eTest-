import {NextFunction, Request, Response} from "express";
import {CommentsService} from "../Service/commentsService";



export const authCommentUser =async (req: Request, res: Response, next: NextFunction) => {
    const commentsService = new CommentsService()
    const resultSearch=await commentsService.getCommentOnId(req.params.id)

    if(!resultSearch){
        return res.sendStatus(404)
    }

    if(resultSearch.commentatorInfo.userId!==req.user?.id){
        return res.sendStatus(403)
    }
    next()
    return;
}