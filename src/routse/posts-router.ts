import {Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createPostValidation,
    errorMessagesInputValidation,
    getCommentsForPostValidation,
    getPostValidation,
    postCommentForPostValidation, updateLikeStatus,
    updatePostValidation
} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authUserIdentificationBearer} from "../Middleware/authUserIdentificationBearer";
import {Containers} from "../composition-root";
import {PostController} from "../Controllers/post-controller";


const postsController = Containers.resolve(PostController)

export const postsRouter = Router({});


postsRouter.get('/', getPostValidation, authUserIdentificationBearer, postsController.getPosts.bind(postsController))

postsRouter.post('/', basicAuthMiddleware, createPostValidation, postsController.createPost.bind(postsController))

postsRouter.get('/:id', authUserIdentificationBearer, postsController.getPost.bind(postsController))

postsRouter.put('/:id', basicAuthMiddleware, updatePostValidation, postsController.updatePost.bind(postsController))

postsRouter.delete('/:id', basicAuthMiddleware, postsController.deletePost.bind(postsController))

postsRouter.get('/:postId/comments', getCommentsForPostValidation, authUserIdentificationBearer, postsController.getCommentsForPost.bind(postsController))

postsRouter.post('/:postId/comments', authMiddleware,postCommentForPostValidation, postsController.createCommentForPost.bind(postsController))

postsRouter.put('/:id/like-status',authMiddleware,updateLikeStatus,postsController.updateLikeStatus.bind(postsController))
