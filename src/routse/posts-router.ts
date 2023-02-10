import {Request,Response,Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createPostValidation, errorMessagesInputValidation, getPostValidation, updatePostValidation} from "../Models/InputValidation";
import {randomUUID} from "crypto";
import {createPost, createPostOnId, findBlogName, findPostOnId, getAllPosts, PostType, updatePostOnId} from "../RepositoryInDB/posts-repositiryDB";
import {postsCollection} from "../db";
import {PaginationTypeInputParamsPostsForBlogs} from "./blogs-router";
export const postsRouter=Router({});


const getPaginationValuesPost= (query: any): PaginationTypeInputParamsPostsForBlogs => {
    return {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection
    }
}

    postsRouter.get('/', getPostValidation, async (req: Request, res: Response) => {
        const paginationResultPosts = getPaginationValuesPost(req.query)
        const resultAllPosts = await getAllPosts(paginationResultPosts);
        return res.status(200).send(resultAllPosts)
    })

    postsRouter.post('/', basicAuthMiddleware, createPostValidation, errorMessagesInputValidation,
        async (req: Request, res: Response) => {
            const titleNewPost = req.body.title;
            const shortDescriptionNewPost = req.body.shortDescription;
            const contentNewPost = req.body.content;
            const blogIdForPost = req.body.blogId;

            const resultCreatePost = await createPostOnId(titleNewPost, shortDescriptionNewPost,
                contentNewPost, blogIdForPost)
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
            const titleUpdatePost = req.body.title;
            const shortDescriptionUpdatePost = req.body.shortDescription;
            const contentUpdatePost = req.body.content;
            const blogIdUpdatePost = req.body.blogId;

            const findUpdatePost = await updatePostOnId(idUpdatePost, titleUpdatePost, shortDescriptionUpdatePost,
                contentUpdatePost, blogIdUpdatePost);
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
