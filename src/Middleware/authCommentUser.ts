import {NextFunction, Request, Response} from "express";
import {CommentService} from "../Service/commentsService";



export const authCommentUser =async (req: Request, res: Response, next: NextFunction) => {
    const commentsService = new CommentService()
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