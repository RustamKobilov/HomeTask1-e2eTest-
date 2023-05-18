import {randomUUID} from "crypto";
import {
    Blog,
    BlogRepository,
    PaginationTypeInputParamsBlogs,
    PaginationTypeUpdateBlog
} from "../RepositoryInDB/blog-repositoryDB";
import {ReturnDistributedDate} from "./helper";
import {inputSortDataBaseType, PaginationTypeInputPosts, Post} from "../RepositoryInDB/post-repositoryDB";

export class BlogService {
    constructor( protected blogsRepository : BlogRepository) {}
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<Blog> {
        const newId = randomUUID();
        const newBlog: Blog = new Blog(newId, nameNewBlog, descriptionNewBlog, websiteUrlNewBlog, new Date().toISOString(), false)

        return newBlog
    }
    async getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):Promise<ReturnDistributedDate<Blog>>{
        return await this.blogsRepository.getBlogs(paginationBlogs)
    }
    async findBlogOnId(id: string): Promise<Blog | null> {
        return await this.blogsRepository.findBlog(id)
    }
    async getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
        Promise<inputSortDataBaseType<Post>> {
        return await this.blogsRepository.getPostsForBlog(paginationPosts,blogId)
    }
    async updateBlogOnId(paginationUpdateBlog:PaginationTypeUpdateBlog):
        Promise<boolean> {
        return await this.blogsRepository.updateBlog(paginationUpdateBlog)
    }
}
