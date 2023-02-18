import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createPostValidation,
    errorMessagesInputValidation,
    getPostValidation,
    updatePostValidation
} from "../Models/InputValidation";
import {randomUUID} from "crypto";
import {
    createPostOnId,
    findBlogName,
    findPostOnId,
    getAllPosts,
    PaginationTypeInputPosts, PaginationTypeInputPostValueForPost,
    PostType,
    updatePostOnId
} from "../RepositoryInDB/posts-repositiryDB";
import {postsCollection} from "../db";
import {postsService} from "./postsService";
import {param} from "express-validator";
import any = jasmine.any;

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

postsRouter.get('/', getPostValidation, async (req: Request, res: Response) => {
    const paginationResultPosts = getPaginationValuesPosts(req.query)
    const resultAllPosts = await getAllPosts(paginationResultPosts);
    return res.status(200).send(resultAllPosts)
})

postsRouter.post('/', basicAuthMiddleware, createPostValidation, errorMessagesInputValidation,
    async (req: Request, res: Response) => {
        const resultPagination=getPaginationPostValueForPost(req.body)
        const resultCreatePost = await postsService.createPostOnId(resultPagination,req.body.id)

        if (!resultCreatePost) {
            return res.sendStatus(404);
        }

        res.status(201).send(resultCreatePost)
    })

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const findPost = await findPostOnId(req.params.id);
    if (findPost) {
        return res.status(200).send(findPost)
    }
    return res.sendStatus(404)
})


postsRouter.put('/:id', basicAuthMiddleware, updatePostValidation, errorMessagesInputValidation,
    async (req: Request, res: Response) => {
        const idUpdatePost = req.params.id;
        const paginationValues=getPaginationPostValueForPost(req.body)
        const findUpdatePost = await updatePostOnId(idUpdatePost,paginationValues,req.body.blogId);
        if (!findUpdatePost) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    })

postsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    const findDeletePost = await findPostOnId(req.params.id);
    if (!findDeletePost) {

        return res.sendStatus(404);
    }
    await postsCollection.deleteOne({id: findDeletePost.id})
    return res.sendStatus(204);
})