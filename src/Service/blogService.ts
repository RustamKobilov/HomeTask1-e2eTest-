import {randomUUID} from "crypto";
import {
    Blog,
    BlogRepository,
    PaginationTypeInputParamsBlogs,
    PaginationTypeUpdateBlog
} from "../RepositoryInDB/blog-repositoryDB";
import {ReturnDistributedDate} from "./helper";
import {inputSortDataBaseType, PaginationTypeInputPosts, Post} from "../RepositoryInDB/post-repositoryDB";
import { inject, injectable } from "inversify";
import {IBlog, IPost, IUser} from "../Models/shemaAndModel";

@injectable()
export class BlogService {
    constructor(@inject(BlogRepository) protected blogsRepository : BlogRepository) {}
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<string> {
        const newId = randomUUID();
        const newBlog: IBlog = new Blog(newId,
            nameNewBlog,
            descriptionNewBlog,
            websiteUrlNewBlog,
            new Date().toISOString(),
            false)
        const idNewBlog = await this.blogsRepository.createBlog(newBlog)

        return newId
    }
    async getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):Promise<ReturnDistributedDate<Blog>>{
        return await this.blogsRepository.getBlogs(paginationBlogs)
    }
    async findBlogOnId(id: string): Promise<IBlog | null> {
        return await this.blogsRepository.findBlog(id)
    }
    async getPostsForBlog(paginationPosts: PaginationTypeInputPosts, blogId: string):
        Promise<inputSortDataBaseType<IPost>> {
        return await this.blogsRepository.getPostsForBlog(paginationPosts,blogId)
    }
    async getPostsForBlogbyUser(paginationPosts: PaginationTypeInputPosts, blogId: string, user:IUser):
        Promise<inputSortDataBaseType<IPost>> {
        return await this.blogsRepository.getPostsForBlogbyUser(paginationPosts,blogId,user)
    }
    async updateBlogOnId(paginationUpdateBlog:PaginationTypeUpdateBlog):
        Promise<boolean> {
        return await this.blogsRepository.updateBlog(paginationUpdateBlog)
    }
}
