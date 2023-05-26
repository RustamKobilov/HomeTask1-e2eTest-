import {Router} from "express";
import {postCommentForPostValidation, updateLikeStatus} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authCommentUser} from "../Middleware/authCommentUser";
import {commentsController} from "../composition-root";
import {authUserIdentification} from "../Middleware/authUserIdentification";

export const commentsRouter=Router({})


commentsRouter.get('/:id',authUserIdentification,commentsController.getComment.bind(commentsController))

commentsRouter.put('/:id',authMiddleware,authCommentUser,postCommentForPostValidation,commentsController.updateComment.bind(commentsController))

commentsRouter.delete('/:id',authMiddleware,authCommentUser,commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:id/like-status',authMiddleware,updateLikeStatus,commentsController.updateLikeStatus.bind(commentsController))

