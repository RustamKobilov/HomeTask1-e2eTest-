import {PaginationTypeInputParamsBlogs, PaginationTypeUpdateBlog} from "../RepositoryInDB/blog-repositoryDB";
import {BlogService} from "../Service/blogService";
import {PostService} from "../Service/postService";
import {Request, Response} from "express";
import {BlogModel} from "../Models/shemaAndModel";
import {getPaginationPostValueForPost, getPaginationValuesPosts} from "./post-controller";

const getPaginationValuesBlogs = (query: any): PaginationTypeInputParamsBlogs => {
    return {
        searchNameTerm: query.searchNameTerm,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1
    }
}
const getPaginationValuesUpdateBlog = (body: any, params: any): PaginationTypeUpdateBlog => {
    return {
        idBlog: params.id,
        nameBlog: body.name,
        descriptionBlog: body.description,
        websiteUrlBlog: body.websiteUrl
    }
}

export class BlogController {
    constructor(protected blogsService: BlogService,
                protected postsService: PostService) {
    }

    async getBlogs(req: Request, res: Response) {
        const paginationResult = getPaginationValuesBlogs(req.query)
        const resultAllBlogs = await this.blogsService.getAllBlog(paginationResult);
        return res.status(200).send(resultAllBlogs)
    }

    async createBlog(req: Request, res: Response) {
        const nameNewBlog = req.body.name;
        const descriptionNewBlog = req.body.description;
        const websiteUrlNewBlog = req.body.websiteUrl;
        const resultCreatBlog = await this.blogsService.createBlog(nameNewBlog, descriptionNewBlog, websiteUrlNewBlog)

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
        const searchBlog = await this.blogsService.findBlogOnId(blogId)
        if (searchBlog == null) {
            return res.sendStatus(404);
        }
        const getAllPostsForBLog = await this.blogsService.getAllPostsForBlogInBase(paginationResult, blogId)

        return res.status(200).send(getAllPostsForBLog);

    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId = req.params.id;
        const paginationResult = getPaginationPostValueForPost(req.body)
        const resultCreatePost = await this.postsService.createPostOnId(paginationResult, blogId)
        console.log(resultCreatePost)
        if (!resultCreatePost) {
            return res.sendStatus(404);
        }

        res.status(201).send(resultCreatePost)
    }

    async getBlog(req: Request, res: Response) {
        const findBlog = await this.blogsService.findBlogOnId(req.params.id);
        if (findBlog) {
            return res.status(200).send(findBlog)
        }
        return res.sendStatus(404)
    }

    async updateBlog(req: Request, res: Response) {
        const paginationResult = getPaginationValuesUpdateBlog(req.body, req.params)

        const UpdateBlog = await this.blogsService.updateBlogOnId(paginationResult);
        if (!UpdateBlog) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }

    async deleteBlog(req: Request, res: Response) {
        const findDeleteBlog = await this.blogsService.findBlogOnId(req.params.id);
        if (!findDeleteBlog) {
            return res.sendStatus(404);
        }
        await BlogModel.deleteOne({id: findDeleteBlog.id})
        return res.sendStatus(204);
    }
}