import {randomUUID} from "crypto";
import {Blog} from "../RepositoryInDB/blog-repositoryDB";

class BlogsService{
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<Blog> {
        const newId = randomUUID();
        const newBlog: Blog = new Blog(newId, nameNewBlog, descriptionNewBlog, websiteUrlNewBlog, new Date().toISOString(), false)

        return newBlog
    }
}

export const blogsService = new BlogsService()