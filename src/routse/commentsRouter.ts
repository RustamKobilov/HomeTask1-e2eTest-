import {Request, Response,Router} from "express";
import {
    CommentatorInfo,
    InputCommentByIdType,
    CommentType, UpdateCommentType,
    getCommentOnId, updateComment
} from "../RepositoryInDB/commentator-repositoryDB";
import {postCommentForPostValidation} from "../Models/InputValidation";
import {blogsCollection, commentsCollection} from "../db";

export const commentsRouter=Router({})

const getPaginationCommentById=(params:any):InputCommentByIdType=>{
    return {
        id:params.id,
    }
}

export const getPaginationUpdateComment=(params:any,body:any):UpdateCommentType=>{
return {
    id:params.commentId,
    content:body.content
}
}

commentsRouter.get('/:id',async (req:Request,res:Response)=>{
    const pagination=getPaginationCommentById(req.params)
    const resultSearch=getCommentOnId(pagination.id)
    if(!resultSearch){
        return res.sendStatus(404)
    }
    return res.status(200).send(resultSearch)
})

//401 and 403 not execute
commentsRouter.put('/:commentId',postCommentForPostValidation,async (res:Response, req:Request)=>{
    const pagination=getPaginationUpdateComment(req.params,req.body)
    const resultCommentUpdate=updateComment(pagination.id,pagination.content)
    if(!resultCommentUpdate){
        return res.sendStatus(404)
    }
    return res.sendStatus(201)
})
////401 and 403 not execute
commentsRouter.delete('/:commentId',async (req:Request,res:Response)=>{
    const pagination=getPaginationCommentById(req.params)
    const resultSearch=getCommentOnId(pagination.id)
    if(!resultSearch){
        return res.sendStatus(404)
    }
    await commentsCollection.deleteOne({id: pagination.id})
    return res.sendStatus(204);
})