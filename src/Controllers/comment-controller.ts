import {InputCommentByIdType, UpdateCommentType} from "../RepositoryInDB/comment-repositoryDB";
import {CommentService} from "../Service/commentsService";
import {Request, Response} from "express";
import {CommentModel} from "../Models/shemaAndModel";

const getPaginationCommentById = (params: any): InputCommentByIdType => {
    return {
        id: params.id
    }
}
export const getPaginationUpdateComment = (params: any, body: any): UpdateCommentType => {
    return {
        id: params.id,
        content: body.content
    }
}
const getPaginationDeleteCommentById = (params: any): InputCommentByIdType => {
    return {
        id: params.id
    }
}

export class CommentController {

    constructor(protected commentService: CommentService) {
    }

    async getComment(req: Request, res: Response) {
        const pagination = getPaginationCommentById(req.params)
        const resultSearch = await this.commentService.getCommentOnId(pagination.id)

        if (!resultSearch) {
            return res.sendStatus(404)
        }
        return res.status(200).send(resultSearch)
    }

    async updateComment(req: Request, res: Response) {

        const pagination = getPaginationUpdateComment(req.params, req.body)
        const resultCommentUpdate = await this.commentService.updateCommentOnId(pagination.id, pagination.content)

        if (!resultCommentUpdate) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async deleteComment(req: Request, res: Response) {
        const pagination = getPaginationDeleteCommentById(req.params)
        const resultSearch = await this.commentService.getCommentOnId(pagination.id)
        if (!resultSearch) {
            return res.sendStatus(404)
        }
        await CommentModel.deleteOne({id: pagination.id})
        return res.sendStatus(204);
    }

    async updatelikeStatus(req: Request, res: Response) {
        console.log(req.params)
        console.log(req.body)
        return res.sendStatus(204)
    }
}