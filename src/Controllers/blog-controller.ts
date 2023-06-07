import {Blog, PaginationTypeInputParamsBlogs, PaginationTypeUpdateBlog} from "../RepositoryInDB/blog-repositoryDB";
import {BlogService} from "../Service/blogService";
import {PostService} from "../Service/postService";
import {Request, Response} from "express";
import {BlogModel} from "../Models/shemaAndModel";
import {getPaginationPostValueForPost, getPaginationValuesPosts} from "./post-controller";
import {inject, injectable } from "inversify";

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

@injectable()
export class BlogController {
    constructor(@inject(BlogService) protected blogsService: BlogService,
                @inject(PostService) protected postsService: PostService) {
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
        const idCreatBlog = await this.blogsService.createBlog(nameNewBlog, descriptionNewBlog, websiteUrlNewBlog)
        const newBlog = await this.blogsService.findBlogOnId(idCreatBlog)
        if(!newBlog){
            return res.sendStatus(404);
        }

        return res.status(201).send(newBlog)
    }

    async getPostForBlog(req: Request, res: Response) {
        const blogId = req.params.id;
        console.log(blogId)
        const paginationResult = getPaginationValuesPosts(req.query)
        const searchBlog = await this.blogsService.findBlogOnId(blogId)
        if (!searchBlog) {
            return res.sendStatus(404)
        }
        if(!req.user) {
            console.log('tyt1')
            const getAllPostsForBLog = await this.blogsService.getPostsForBlog(paginationResult, blogId)
            return res.status(200).send(getAllPostsForBLog)
        }
        console.log('tyt2')
        const getAllPostsForBLogbyUser = await this.blogsService.getPostsForBlogbyUser(paginationResult, blogId,req.user)
        return res.status(200).send(getAllPostsForBLogbyUser)
    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId = req.params.id;
        const paginationResult = getPaginationPostValueForPost(req.body)
        const resultCreatePost = await this.postsService.createPostOnId(paginationResult, blogId)
        console.log(resultCreatePost)
        if (!resultCreatePost) {
            return res.sendStatus(404)
        }
        const newPost = await this.postsService.getPost(resultCreatePost)
        if (!newPost) {
            return res.sendStatus(404)
        }
        res.status(201).send(newPost)
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