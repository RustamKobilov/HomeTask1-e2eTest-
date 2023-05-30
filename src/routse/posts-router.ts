import {Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createPostValidation,
    errorMessagesInputValidation,
    getCommentsForPostValidation,
    getPostValidation,
    postCommentForPostValidation,
    updatePostValidation
} from "../Models/InputValidation";
import {authMiddleware} from "../Middleware/authMiddleware";
import {authUserIdentification} from "../Middleware/authUserIdentification";
import { PostContainer } from "../composition-root";
import { PostController } from "../Controllers/post-controller";

const postsController = PostContainer.resolve(PostController)

export const postsRouter = Router({});


postsRouter.get('/', getPostValidation, postsController.getPosts.bind(postsController))

postsRouter.post('/', basicAuthMiddleware, createPostValidation, errorMessagesInputValidation, postsController.createPost.bind(postsController))

postsRouter.get('/:id', postsController.getPost.bind(postsController))

postsRouter.put('/:id', basicAuthMiddleware, updatePostValidation, errorMessagesInputValidation, postsController.updatePost.bind(postsController))

postsRouter.delete('/:id', basicAuthMiddleware, postsController.deletePost.bind(postsController))

postsRouter.get('/:postId/comments', getCommentsForPostValidation, authUserIdentification, postsController.getCommentsForPost.bind(postsController))

postsRouter.post('/:postId/comments', authMiddleware,postCommentForPostValidation, postsController.createCommentForPost.bind(postsController))

