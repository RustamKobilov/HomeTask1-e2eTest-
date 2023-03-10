import {NextFunction, Request, Response} from "express";
import {getCommentOnId} from "../RepositoryInDB/commentator-repositoryDB";


export const authCommentUser =async (req: Request, res: Response, next: NextFunction) => {
    const resultSearch=await getCommentOnId(req.params.id)
    console.log(resultSearch)
    if(!resultSearch){
        return res.sendStatus(404)
    }
    console.log(req.user?.id)
    if(resultSearch.commentatorInfo.userId!==req.user?.id){
        return res.sendStatus(403)
    }
    next()
    return;
}