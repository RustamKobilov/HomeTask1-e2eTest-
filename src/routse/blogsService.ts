import {randomUUID} from "crypto";
import {
    Blog,
    BlogRepository,
    PaginationTypeInputParamsBlogs,
    PaginationTypeUpdateBlog
} from "../RepositoryInDB/blog-repositoryDB";
import {ReturnDistributedDate} from "../RepositoryInDB/helper";
import {inputSortDataBaseType, PaginationTypeInputPosts, Post} from "../RepositoryInDB/posts-repositoryDB";

export class BlogsService{
    private blogRepository=new BlogRepository
    constructor() {
        this.blogRepository=new BlogRepository()
    }
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<Blog> {
        const newId = randomUUID();
        const newBlog: Blog = new Blog(newId, nameNewBlog, descriptionNewBlog, websiteUrlNewBlog, new Date().toISOString(), false)

        return newBlog
    }
    async getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):Promise<ReturnDistributedDate<Blog>>{
        return await this.blogRepository.getBlogs(paginationBlogs)
    }
    async findBlogOnId(id: string): Promise<Blog | null> {
        return await this.blogRepository.findBlog(id)
    }
    async getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
        Promise<inputSortDataBaseType<Post>> {
        return await this.blogRepository.getPostsForBlog(paginationPosts,blogId)
    }
    async updateBlogOnId(paginationUpdateBlog:PaginationTypeUpdateBlog):
        Promise<boolean> {
        return await this.blogRepository.updateBlog(paginationUpdateBlog)
    }
}

//export const blogsService = new BlogsService()