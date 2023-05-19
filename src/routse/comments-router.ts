import {Router} from "express";
import {postCommentForPostValidation} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authCommentUser} from "../Middleware/authCommentUser";
import {commentsController} from "../composition-root";

export const commentsRouter=Router({})


commentsRouter.get('/:id',commentsController.getComment.bind(commentsController))

commentsRouter.put('/:id',authMiddleware,authCommentUser,postCommentForPostValidation,commentsController.updateComment.bind(commentsController))

commentsRouter.delete('/:id',authMiddleware,authCommentUser,commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:id/like-status',/*authMiddleware,*/commentsController.updatelikeStatus.bind(commentsController))

