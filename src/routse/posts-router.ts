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
    findPostOnId,
    getAllPosts, PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPosts, PaginationTypeInputPostValueForPost,
    PaginationTypePostInputCommentByPost,
    updatePostOnId
} from "../RepositoryInDB/posts-repositiryDB";
import {postsService} from "./postsService";
import {authMiddleware} from "../Middleware/authMiddleware";
import {getAllCommentForPostInBase, getCommentOnId} from "../RepositoryInDB/commentator-repositoryDB";
import {PostModel} from "../shemaAndModel";

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


postsRouter.get('/', getPostValidation, async (req: Request, res: Response) => {
    const paginationResultPosts = getPaginationValuesPosts(req.query)
    const resultAllPosts = await getAllPosts(paginationResultPosts);
    return res.status(200).send(resultAllPosts)
})

postsRouter.post('/', basicAuthMiddleware, createPostValidation, errorMessagesInputValidation,
    async (req: Request, res: Response) => {
        const resultPagination=getPaginationPostValueForPost(req.body)
        const resultCreatePost = await postsService.createPostOnId(resultPagination,req.body.blogId)

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
    await PostModel.deleteOne({id: findDeletePost.id})
    return res.sendStatus(204);
})


postsRouter.get('/:postId/comments', getCommentsForPostValidation,async (req: Request, res: Response) => {
    const pagination=getPaginationGetCommentForPost(req.query,req.params)
    const resultSearchPost=await findPostOnId(pagination.idPost)
    if(!resultSearchPost){
        return res.sendStatus(404)
    }
    const resultAllCommentsByPosts = await getAllCommentForPostInBase(pagination);
    return res.status(200).send(resultAllCommentsByPosts)
})
postsRouter.post('/:postId/comments', authMiddleware,postCommentForPostValidation,async (req: Request, res: Response) => {
    const pagination=getPaginationPostCommentForPost(req.params,req.body)
    const user=req.user!

    const resultSearchPost=await findPostOnId(pagination.idPost)
    if(!resultSearchPost){
        return res.sendStatus(404)
    }
    const addCommentByPost=await postsService.createCommentOnId(pagination,user)
    return res.status(201).send(addCommentByPost)

})

