import {randomUUID} from "crypto";
import {Blog} from "../RepositoryInDB/blog-repositoryDB";

export const blogsService={
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<Blog> {
        const newId = randomUUID();
        const newBlog: Blog = new Blog(newId, nameNewBlog, descriptionNewBlog, websiteUrlNewBlog, new Date().toISOString(), false)

        return newBlog
    }
}