import {randomUUID} from "crypto";
import {BlogsType} from "../RepositoryInDB/blog-repositoryDB";

export const blogsService={
    async createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<BlogsType> {
        const newId = randomUUID();
        const newBlog: BlogsType = {
            id: newId,
            name: nameNewBlog,
            description: descriptionNewBlog,
            websiteUrl: websiteUrlNewBlog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return newBlog;
    },

}