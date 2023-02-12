import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createBlogValidation,
    createPostValidation,
    errorMessagesInputValidation,
    getBlogsValidation,
    getPostForBlogsValidation, postPostForBlogsValidation,
    updateBlogValidation
} from "../Models/InputValidation";
import {
    findBlogOnId,
    updateBlogOnId,
    getAllBlog,
    createBlog,
    getAllPostsForBlogInBase, PaginationTypeInputParamsBlogs
} from "../RepositoryInDB/blog-repositoryDB";
import {blogsCollection} from "../db";
import {createPostOnId} from "../RepositoryInDB/posts-repositiryDB";
import {getPaginationValuesPosts} from "./posts-router";

export const blogsRouter = Router({});

const getPaginationValuesBlogs = (query: any): PaginationTypeInputParamsBlogs => {
    return {
        searchNameTerm: query.searchNameTerm,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection
    }
}


blogsRouter.get('/', getBlogsValidation, async (req: Request, res: Response) => {
    const paginationResult = getPaginationValuesBlogs(req.query)
    const resultAllBlogs = await getAllBlog(paginationResult);
    return res.status(200).send(resultAllBlogs)
})


blogsRouter.post('/', basicAuthMiddleware, createBlogValidation, errorMessagesInputValidation,
    async (req: Request, res: Response) => {

        const nameNewBlog = req.body.name;
        const descriptionNewBlog = req.body.description;
        const websiteUrlNewBlog = req.body.websiteUrl;
        const resultCreatBlog = await createBlog(nameNewBlog, descriptionNewBlog, websiteUrlNewBlog)

        await blogsCollection.insertOne(resultCreatBlog);
        return res.status(201).send({
            id: resultCreatBlog.id,
            name: resultCreatBlog.name,
            description: resultCreatBlog.description,
            websiteUrl: resultCreatBlog.websiteUrl,
            createdAt: resultCreatBlog.createdAt,
            isMembership: resultCreatBlog.isMembership
        })

    })

blogsRouter.get('/:id/posts', getPostForBlogsValidation, errorMessagesInputValidation, async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const paginationResult = getPaginationValuesPosts(req.query)

    const searchBlog=await findBlogOnId(blogId)
    console.log(searchBlog)
    if (searchBlog==null) {
        return res.sendStatus(404);
    }

    const getAllPostsForBLog = await getAllPostsForBlogInBase(paginationResult, blogId)

    return res.status(200).send(getAllPostsForBLog);

})
blogsRouter.post('/:id/posts', basicAuthMiddleware, postPostForBlogsValidation, errorMessagesInputValidation, async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const titleNewPost = req.body.title;
    const shortDescriptionNewPost = req.body.shortDescription;
    const contentNewPost = req.body.content;

    const resultCreatePost = await createPostOnId(titleNewPost, shortDescriptionNewPost, contentNewPost, blogId)

    if (!resultCreatePost) {
        return res.sendStatus(404);
    }

    res.status(201).send(resultCreatePost)
})


blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await findBlogOnId(req.params.id);
    if (findBlog) {
        return res.status(200).send(findBlog)
    }
    return res.sendStatus(404)
})

blogsRouter.put('/:id', basicAuthMiddleware, updateBlogValidation, errorMessagesInputValidation,
    async (req: Request, res: Response) => {

        const idBlog = req.params.id;
        const nameUpdateBlog = req.body.name;
        const descriptionUpdateBlog = req.body.description;
        const websiteUrlUpdateBlog = req.body.websiteUrl;

        const UpdateBlog = await updateBlogOnId(idBlog, nameUpdateBlog, descriptionUpdateBlog, websiteUrlUpdateBlog);
        if (!UpdateBlog) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    })

blogsRouter.delete('/:id', basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const findDeleteBlog = await findBlogOnId(req.params.id);
        if (!findDeleteBlog) {
            return res.sendStatus(404);
        }
        await blogsCollection.deleteOne({id: findDeleteBlog.id})
        return res.sendStatus(204);
    })