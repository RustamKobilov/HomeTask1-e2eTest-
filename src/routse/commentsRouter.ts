import {Request, Response,Router} from "express";
import {
    CommentatorInfo,
    InputCommentByIdType,
    CommentType, UpdateCommentType,
    getCommentOnId, updateComment
} from "../RepositoryInDB/commentator-repositoryDB";
import {postCommentForPostValidation} from "../Models/InputValidation";
import {blogsCollection, commentsCollection} from "../db";
import {authMiddleware} from "../Middleware/authMiddleware";
import {createSecureServer} from "http2";

export const commentsRouter=Router({})

const getPaginationCommentById=(params:any):InputCommentByIdType=>{
    return {
        id:params.id
    }
}

export const getPaginationUpdateComment=(params:any,body:any):UpdateCommentType=>{
return {
    id:params.id,
    content:body.content
}
}

const getPaginationDeleteCommentById=(params:any):InputCommentByIdType=>{
    return {
        id:params.commentId
    }
}

commentsRouter.get('/:id',async (req:Request,res:Response)=>{
    const pagination=getPaginationCommentById(req.params)
    const resultSearch=await getCommentOnId(pagination.id)

    if(!resultSearch){
        return res.sendStatus(404)
    }

    return res.status(200).send(resultSearch)
})

//401 and 403 not execute
commentsRouter.put('/:id',authMiddleware,postCommentForPostValidation,async (req:Request,res:Response)=>{
    console.log(req.params.id)

    const pagination=getPaginationUpdateComment(req.params,req.body)
    const resultCommentUpdate=await updateComment(pagination.id,pagination.content)
    console.log(resultCommentUpdate)
    if(!resultCommentUpdate){
        return res.sendStatus(404)
    }
    return res.sendStatus(204)
})
////401 and 403 not execute
commentsRouter.delete('/:commentId',authMiddleware,async (req:Request,res:Response)=>{
    const pagination=getPaginationDeleteCommentById(req.params)
    const resultSearch=await getCommentOnId(pagination.id)
    console.log(resultSearch)
    if(!resultSearch){
        return res.sendStatus(404)
    }
    await commentsCollection.deleteOne({id: pagination.id})
    return res.sendStatus(204);
})