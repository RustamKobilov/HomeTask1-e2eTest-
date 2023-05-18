import {randomUUID} from "crypto";
import {
    inputSortDataBaseType,
    PaginationTypeGetInputCommentByPost, PaginationTypeInputPosts,
    PaginationTypeInputPostValueForPost, Post, PostRepository,
} from "../RepositoryInDB/post-repositoryDB";

export class PostService {

    constructor(protected postsRepository : PostRepository) {}
    async getAllPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<Post>> {
        return await this.postsRepository.getPosts(paginationPosts)
    }
    async findPostOnId(id: string): Promise<Post | null> {
        return await this.postsRepository.findPost(id)
    }
    async createPost(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string,
                     blogIdForPost: string, blogNameForPost: string): Promise<Post> {
        const idNewPost = randomUUID();

        const newPost: Post = new Post(idNewPost,
            titleNewPost,
            shortDescriptionNewPost,
            contentNewPost, blogIdForPost,
            blogNameForPost,
            new Date().toISOString())
        const addNewPost = await this.postsRepository.createPost(newPost)

        return addNewPost;
    }
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<Post|boolean> {
        const blogNameForPost = await this.postsRepository.findBlogName(blogId);

        if (!blogNameForPost) {
            return false;
        }
        const resultCreatePost = await this.createPost(pagination.titlePost, pagination.shortDescriptionPost,
            pagination.contentPost, blogId, blogNameForPost.name)
    return resultCreatePost
    }
    async updatePostOnId(id: string, pagination:PaginationTypeInputPostValueForPost,blogId:string): Promise<boolean> {
        return await this.postsRepository.updatePost(id,pagination,blogId)
    }
}

