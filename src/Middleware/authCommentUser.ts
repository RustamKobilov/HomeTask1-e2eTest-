import {NextFunction, Request, Response} from "express";
import {CommentService} from "../Service/commentsService";
import {CommentRepository} from "../RepositoryInDB/comment-repositoryDB";



export const authCommentUser =async (req: Request, res: Response, next: NextFunction) => {
    const commentsRepository = new CommentRepository()
    const commentsService = new CommentService(commentsRepository)
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