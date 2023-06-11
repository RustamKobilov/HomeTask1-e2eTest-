import {CommentService} from "../Service/commentsService";
import {Request, Response} from "express";
import {CommentModel} from "../Models/shemaAndModel";
import {inject, injectable} from "inversify";

@injectable()
export class CommentController {

    constructor(@inject(CommentService) protected commentService: CommentService) {
    }

    async getComment(req: Request, res: Response) {
        let resultSearch
        if (!req.user) {
            resultSearch = await this.commentService.getCommentOnId(req.params.id)
            if (!resultSearch) {
                return res.sendStatus(404)
            }

            return res.status(200).send(resultSearch)
        }
        console.log(req.user)
        resultSearch = await this.commentService.getCommentOnIdForUser(req.params.id, req.user)

        if (!resultSearch) {
            return res.sendStatus(404)
        }
        return res.status(200).send(resultSearch)
    }

    async updateComment(req: Request, res: Response) {

        const resultCommentUpdate = await this.commentService.updateCommentOnId(req.params.id, req.body.content)

        if (!resultCommentUpdate) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async deleteComment(req: Request, res: Response) {
        const resultSearch = await this.commentService.getCommentOnId(req.params.id)
        if (!resultSearch) {
            return res.sendStatus(404)
        }
        await CommentModel.deleteOne({id: req.params.id})
        return res.sendStatus(204);
    }

    async updateLikeStatus(req: Request, res: Response) {
        const resultSearchComment = await this.commentService.getCommentOnId(req.params.id)
        if (!resultSearchComment) {
            return res.sendStatus(404)
        }

        await this.commentService.changeCountLikeStatusUser(resultSearchComment, req.user, req.body.likeStatus)


        return res.sendStatus(204)
    }
}