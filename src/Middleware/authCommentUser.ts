import {NextFunction, Request, Response} from "express";
import {commentsRepository} from "../RepositoryInDB/comments-repositoryDB";


export const authCommentUser =async (req: Request, res: Response, next: NextFunction) => {
    const resultSearch=await commentsRepository.getCommentOnId(req.params.id)

    if(!resultSearch){
        return res.sendStatus(404)
    }

    if(resultSearch.commentatorInfo.userId!==req.user?.id){
        return res.sendStatus(403)
    }
    next()
    return;
}