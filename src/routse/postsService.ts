import {randomUUID} from "crypto";
import {findBlogName, PaginationTypeInputPostValueForPost, PostType} from "../RepositoryInDB/posts-repositiryDB";

export const postsService={
    async createPost(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string,
                              blogIdForPost: string, blogNameForPost: string): Promise<PostType> {
        const idNewPost = randomUUID();

        const newPost: PostType = {
            id: idNewPost,
            title: titleNewPost,
            shortDescription: shortDescriptionNewPost,
            content: contentNewPost,
            blogId: blogIdForPost,
            blogName: blogNameForPost,
            createdAt: new Date().toISOString()
        };

        return newPost;
    },
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<PostType|boolean> {
        const blogNameForPost = await findBlogName(blogId);

        if (!blogNameForPost) {
            return false;
        }
        const resultCreatePost = await postsService.createPost(pagination.titlePost, pagination.shortDescriptionPost,
            pagination.contentPost, blogId, blogNameForPost.name)
    return resultCreatePost
    }

}