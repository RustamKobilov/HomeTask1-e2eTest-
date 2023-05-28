import {
    PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPosts,
    PaginationTypeInputPostValueForPost,
    PaginationTypePostInputCommentByPost
} from "../RepositoryInDB/post-repositoryDB";
import {PostService} from "../Service/postService";
import {CommentService} from "../Service/commentsService";
import {Request, Response} from "express";
import {PostModel} from "../Models/shemaAndModel";

export const getPaginationValuesPosts = (query: any): PaginationTypeInputPosts => {
    return {
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}
export const getPaginationPostValueForPost = (query: any): PaginationTypeInputPostValueForPost => {
    return {
        titlePost: query.title,
        shortDescriptionPost: query.shortDescription,
        contentPost: query.content
    }
}
export const getPaginationGetCommentForPost = (query: any, params: any): PaginationTypePostInputCommentByPost => {
    return {
        idPost: params.postId,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}
export const getPaginationPostCommentForPost = (params: any, body: any): PaginationTypeGetInputCommentByPost => {
    return {
        idPost: params.postId,
        content: body.content
    }
}

export class PostController {
    constructor(protected postService: PostService, protected commentService: CommentService) {
    }

    async getPosts(req: Request, res: Response) {
        const paginationResultPosts = getPaginationValuesPosts(req.query)
        const posts = await this.postService.getAllPosts(paginationResultPosts);
        return res.status(200).send(posts)
    }

    async createPost(req: Request, res: Response) {
        const resultPagination = getPaginationPostValueForPost(req.body)
        const resultCreatePost = await this.postService.createPostOnId(resultPagination, req.body.blogId)

        if (!resultCreatePost) {
            return res.sendStatus(404);
        }

        res.status(201).send(resultCreatePost)
    }

    async getPost(req: Request, res: Response) {
        const findPost = await this.postService.findPostOnId(req.params.id);
        if (findPost) {
            return res.status(200).send(findPost)
        }
        return res.sendStatus(404)
    }

    async updatePost(req: Request, res: Response) {
        const idUpdatePost = req.params.id;
        const paginationValues = getPaginationPostValueForPost(req.body)
        const findUpdatePost = await this.postService.updatePostOnId(idUpdatePost, paginationValues, req.body.blogId);
        if (!findUpdatePost) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    }

    async deletePost(req: Request, res: Response) {
        const findDeletePost = await this.postService.findPostOnId(req.params.id);
        if (!findDeletePost) {

            return res.sendStatus(404);
        }
        await PostModel.deleteOne({id: findDeletePost.id})
        return res.sendStatus(204);
    }

    async getCommentsForPost(req: Request, res: Response) {
        const pagination = getPaginationGetCommentForPost(req.query, req.params)
        const resultSearchPost = await this.postService.findPostOnId(pagination.idPost)
        if (!resultSearchPost) {
            return res.sendStatus(404)
        }
        let resultAllCommentsByPosts
        if(!req.user) {
             resultAllCommentsByPosts = await this.commentService.getAllCommentForPostInBase(pagination);
            return res.status(200).send(resultAllCommentsByPosts)
        }
        resultAllCommentsByPosts = await this.commentService.getAllCommentForPostInBaseForUser(pagination,req.user)



        return res.status(200).send(resultAllCommentsByPosts)
    }

    async createCommentForPost(req: Request, res: Response) {
        const pagination = getPaginationPostCommentForPost(req.params, req.body)
        const user = req.user!

        const resultSearchPost = await this.postService.findPostOnId(pagination.idPost)
        if (!resultSearchPost) {
            return res.sendStatus(404)
        }
        const addCommentByPost = await this.commentService.createCommentOnId(pagination, user)//return id new comment
        const newCommentByPost = await this.commentService.getCommentOnId(addCommentByPost)

        return res.status(201).send(newCommentByPost)

    }

}