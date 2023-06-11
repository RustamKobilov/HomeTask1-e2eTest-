import {CommentService} from "../Service/commentsService";
import {Request, Response} from "express";
import {PostModel} from "../Models/shemaAndModel";
import {inject, injectable } from "inversify";
import {PostService} from "../Service/postService";
import {
    PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPosts,
    PaginationTypeInputPostValueForPost,
    PaginationTypePostInputCommentByPost
} from "../Models/allTypes";

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

@injectable()
export class PostController {
    constructor(@inject(PostService) protected postService: PostService,
                @inject(CommentService) protected commentService: CommentService) {
    }

    async getPosts(req: Request, res: Response) {
        const paginationResultPosts = getPaginationValuesPosts(req.query)
        let posts
        if(!req.user) {
            posts = await this.postService.getAllPosts(paginationResultPosts)
            return res.status(200).send(posts)
        }
        posts = await this.postService.getAllPostsForUser(paginationResultPosts,req.user)
        return res.status(200).send(posts)
    }

    async getPost(req: Request, res: Response) {
        let post
        if(!req.user) {
            post = await this.postService.getPost(req.params.id);
            if (!post) {
                return res.sendStatus(404)
            }
            return res.status(200).send(post)
        }
        post = await this.postService.getPostForUser(req.params.id,req.user)
        if (!post) {
            return res.sendStatus(404)
        }
        return res.status(200).send(post)
    }

    async createPost(req: Request, res: Response) {
        const resultPagination = getPaginationPostValueForPost(req.body)
        const addCreatePostbyBlog = await this.postService.createPostOnId(resultPagination, req.body.blogId)//return id new comment

        if (!addCreatePostbyBlog) {
            return res.sendStatus(404);
        }
        const newCommentByPost = await this.postService.getPost(addCreatePostbyBlog)

        res.status(201).send(newCommentByPost)
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
        const findDeletePost = await this.postService.getPost(req.params.id);
        if (!findDeletePost) {

            return res.sendStatus(404);
        }
        await PostModel.deleteOne({id: findDeletePost.id})
        return res.sendStatus(204);
    }

    async getCommentsForPost(req: Request, res: Response) {
        const pagination = getPaginationGetCommentForPost(req.query, req.params)
        const resultSearchPost = await this.postService.getPost(pagination.idPost)
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

        const resultSearchPost = await this.postService.getPost(pagination.idPost)
        if (!resultSearchPost) {
            return res.sendStatus(404)
        }
        const addCommentByPost = await this.commentService.createCommentOnId(pagination, user)//return id new comment
        const newCommentByPost = await this.commentService.getCommentOnId(addCommentByPost)
        if(!newCommentByPost){
            return res.sendStatus(404)
        }

        return res.status(201).send(newCommentByPost)

    }

    async updateLikeStatus(req: Request, res: Response) {
        const post = await this.postService.getPost(req.params.id)
        console.log(post)
        if (!post) {
            return res.sendStatus(404)
        }

        await this.postService.changeCountLikeStatusUser(post,req.user, req.body.likeStatus)

        return res.sendStatus(204)
    }

}