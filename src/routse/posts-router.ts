import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    postCommentForPostValidation,
    createPostValidation,
    errorMessagesInputValidation,
    getPostValidation,
    updatePostValidation, getCommentsForPostValidation
} from "../Models/InputValidation";

import {
    PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPosts,
    PaginationTypeInputPostValueForPost, PaginationTypePostInputCommentByPost,
    postsRepository
} from "../RepositoryInDB/posts-repositoryDB";
import {postsService} from "./postsService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {commentsRepository} from "../RepositoryInDB/comments-repositoryDB";
import {PostModel} from "../Models/shemaAndModel";

export const postsRouter = Router({});

export const getPaginationValuesPosts = (query: any): PaginationTypeInputPosts => {
    return {
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}
export const getPaginationPostValueForPost=(query:any):PaginationTypeInputPostValueForPost=> {
    return {
        titlePost: query.title,
        shortDescriptionPost: query.shortDescription,
        contentPost: query.content
    }
}

export const getPaginationGetCommentForPost=(query:any,params:any):PaginationTypePostInputCommentByPost=>{
    return {
        idPost:params.postId,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}

export const getPaginationPostCommentForPost=(params:any, body:any):PaginationTypeGetInputCommentByPost=>{
    return {
        idPost: params.postId,
        content: body.content
    }
    }

class PostController{
    async getPosts(req: Request, res: Response) {
        const paginationResultPosts = getPaginationValuesPosts(req.query)
        const resultAllPosts = await postsRepository.getAllPosts(paginationResultPosts);
        return res.status(200).send(resultAllPosts)
    }

    async createPost(req: Request, res: Response) {
        const resultPagination = getPaginationPostValueForPost(req.body)
        const resultCreatePost = await postsService.createPostOnId(resultPagination, req.body.blogId)

        if (!resultCreatePost) {
            return res.sendStatus(404);
        }

        res.status(201).send(resultCreatePost)
    }

    async getPost(req: Request, res: Response) {
        const findPost = await postsRepository.findPostOnId(req.params.id);
        if (findPost) {
            return res.status(200).send(findPost)
        }
        return res.sendStatus(404)
    }

    async updatePost(req: Request, res: Response) {
        const idUpdatePost = req.params.id;
        const paginationValues = getPaginationPostValueForPost(req.body)
        const findUpdatePost = await postsRepository.updatePostOnId(idUpdatePost, paginationValues, req.body.blogId);
        if (!findUpdatePost) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    }

    async deletePost(req: Request, res: Response) {
        const findDeletePost = await postsRepository.findPostOnId(req.params.id);
        if (!findDeletePost) {

            return res.sendStatus(404);
        }
        await PostModel.deleteOne({id: findDeletePost.id})
        return res.sendStatus(204);
    }

    async getCommentsForPost(req: Request, res: Response) {
        const pagination = getPaginationGetCommentForPost(req.query, req.params)
        const resultSearchPost = await postsRepository.findPostOnId(pagination.idPost)
        if (!resultSearchPost) {
            return res.sendStatus(404)
        }
        const resultAllCommentsByPosts = await commentsRepository.getAllCommentForPostInBase(pagination);
        return res.status(200).send(resultAllCommentsByPosts)
    }

    async createCommentForPost(req: Request, res: Response) {
        const pagination = getPaginationPostCommentForPost(req.params, req.body)
        const user = req.user!

        const resultSearchPost = await postsRepository.findPostOnId(pagination.idPost)
        if (!resultSearchPost) {
            return res.sendStatus(404)
        }
        const addCommentByPost = await postsService.createCommentOnId(pagination, user)
        return res.status(201).send(addCommentByPost)

    }

}

const postController = new PostController()

postsRouter.get('/', getPostValidation, postController.getPosts)

postsRouter.post('/', basicAuthMiddleware, createPostValidation, errorMessagesInputValidation, postController.createPost)

postsRouter.get('/:id', postController.getPosts)

postsRouter.put('/:id', basicAuthMiddleware, updatePostValidation, errorMessagesInputValidation, postController.updatePost)

postsRouter.delete('/:id', basicAuthMiddleware, postController.deletePost)

postsRouter.get('/:postId/comments', getCommentsForPostValidation, postController.getCommentsForPost)

postsRouter.post('/:postId/comments', authMiddleware,postCommentForPostValidation, postController.createCommentForPost)

