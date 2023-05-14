import {Request, Response,Router} from "express";
import {
    commentsRepository, InputCommentByIdType, UpdateCommentType
} from "../RepositoryInDB/comments-repositoryDB";
import {postCommentForPostValidation} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authCommentUser} from "../Middleware/authCommentUser";
import {CommentModel} from "../Models/shemaAndModel";

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
        id:params.id
    }
}

class CommentController{
    async getComment(req: Request, res: Response) {
        const pagination = getPaginationCommentById(req.params)
        const resultSearch = await commentsRepository.getCommentOnId(pagination.id)

        if (!resultSearch) {
            return res.sendStatus(404)
        }
        return res.status(200).send(resultSearch)
    }

    async updateComment(req: Request, res: Response) {

        const pagination = getPaginationUpdateComment(req.params, req.body)
        const resultCommentUpdate = await commentsRepository.updateComment(pagination.id, pagination.content)

        if (!resultCommentUpdate) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async deleteComment(req: Request, res: Response) {
        const pagination = getPaginationDeleteCommentById(req.params)
        const resultSearch = await commentsRepository.getCommentOnId(pagination.id)
        if (!resultSearch) {
            return res.sendStatus(404)
        }
        await CommentModel.deleteOne({id: pagination.id})
        return res.sendStatus(204);
}
}
const commentController = new CommentController()

commentsRouter.get('/:id',commentController.getComment)

commentsRouter.put('/:id',authMiddleware,authCommentUser,postCommentForPostValidation,commentController.updateComment)

commentsRouter.delete('/:id',authMiddleware,authCommentUser,commentController.deleteComment)

