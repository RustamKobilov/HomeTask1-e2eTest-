import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createBlogValidation,
    errorMessagesInputValidation,
    getBlogsValidation,
    getPostForBlogsValidation, postPostForBlogsValidation,
    updateBlogValidation
} from "../Models/InputValidation";
import {
    PaginationTypeInputParamsBlogs, blogRepository
} from "../RepositoryInDB/blog-repositoryDB";
import {getPaginationPostValueForPost, getPaginationValuesPosts} from "./posts-router";
import {blogsService} from "./blogsService";
import {postsService} from "./postsService";
import {BlogModel} from "../Models/shemaAndModel";

export const blogsRouter = Router({});

const getPaginationValuesBlogs = (query: any): PaginationTypeInputParamsBlogs => {
    return {
        searchNameTerm: query.searchNameTerm,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}

class BlogController{
    async getBlogs(req: Request, res: Response) {
    const paginationResult = getPaginationValuesBlogs(req.query)
    const resultAllBlogs =await blogRepository.getAllBlog(paginationResult);
    return res.status(200).send(resultAllBlogs)
}

    async createBlog(req: Request, res: Response) {

        const nameNewBlog = req.body.name;
        const descriptionNewBlog = req.body.description;
        const websiteUrlNewBlog = req.body.websiteUrl;
        const resultCreatBlog = await blogsService.createBlog(nameNewBlog, descriptionNewBlog, websiteUrlNewBlog)

        await BlogModel.insertMany(resultCreatBlog);
        return res.status(201).send({
            id: resultCreatBlog.id,
            name: resultCreatBlog.name,
            description: resultCreatBlog.description,
            websiteUrl: resultCreatBlog.websiteUrl,
            createdAt: resultCreatBlog.createdAt,
            isMembership: resultCreatBlog.isMembership
        })
    }

    async getPostForBlog(req: Request, res: Response) {
        const blogId = req.params.id;
        const paginationResult = getPaginationValuesPosts(req.query)
        const searchBlog = await blogRepository.findBlogOnId(blogId)
        if (searchBlog == null) {
            return res.sendStatus(404);
        }

        const getAllPostsForBLog = await blogRepository.getAllPostsForBlogInBase(paginationResult, blogId)

        return res.status(200).send(getAllPostsForBLog);

    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId = req.params.id;
        const paginationResult = getPaginationPostValueForPost(req.body)
        const resultCreatePost = await postsService.createPostOnId(paginationResult, blogId)
        console.log(resultCreatePost)
        if (!resultCreatePost) {
            return res.sendStatus(404);
        }

        res.status(201).send(resultCreatePost)
    }

    async getBlog(req: Request, res: Response) {
        const findBlog = await blogRepository.findBlogOnId(req.params.id);
        if (findBlog) {
            return res.status(200).send(findBlog)
        }
        return res.sendStatus(404)
    }

    async updateBlog(req: Request, res: Response) {
        const idBlog = req.params.id;
        const nameUpdateBlog = req.body.name;
        const descriptionUpdateBlog = req.body.description;
        const websiteUrlUpdateBlog = req.body.websiteUrl;

        const UpdateBlog = await blogRepository.updateBlogOnId(idBlog, nameUpdateBlog, descriptionUpdateBlog, websiteUrlUpdateBlog);
        if (!UpdateBlog) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }

    async deleteBlog(req: Request, res: Response) {
        const findDeleteBlog = await blogRepository.findBlogOnId(req.params.id);
        if (!findDeleteBlog) {
            return res.sendStatus(404);
        }
        await BlogModel.deleteOne({id: findDeleteBlog.id})
        return res.sendStatus(204);
    }
}
const blogController = new BlogController()

blogsRouter.get('/', getBlogsValidation, blogController.getBlogs)

blogsRouter.post('/', basicAuthMiddleware, createBlogValidation, errorMessagesInputValidation, blogController.createBlog)

blogsRouter.get('/:id/posts', getPostForBlogsValidation, errorMessagesInputValidation, blogController.getPostForBlog)

blogsRouter.post('/:id/posts', basicAuthMiddleware, postPostForBlogsValidation, errorMessagesInputValidation, blogController.createPostForBlog)

blogsRouter.get('/:id', blogController.getBlog)

blogsRouter.put('/:id', basicAuthMiddleware, updateBlogValidation, errorMessagesInputValidation, blogController.updateBlog)

blogsRouter.delete('/:id', basicAuthMiddleware, blogController.deleteBlog)