import {randomUUID} from "crypto";
import {
    LikesInfoPosts,
    Post,
    PostRepository,
} from "../RepositoryInDB/post-repositoryDB";
import {likeStatus} from "../Models/Enums";
import {IPost, IReaction, IUser} from "../Models/shemaAndModel";
import {inject, injectable} from "inversify";
import {inputSortDataBaseType, PaginationTypeInputPosts, PaginationTypeInputPostValueForPost} from "../Models/allTypes";


@injectable()
export class PostService {

    constructor(@inject(PostRepository) protected postsRepository : PostRepository) {}
    private createReaction(parentId: string, userId: string, userLogin:string, status: likeStatus): IReaction {
        return {
            parentId,
            userId,
            userLogin,
            status,
            createdAt: new Date().toISOString()
        }
    }
    async getAllPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<Post>> {
        return await this.postsRepository.getPosts(paginationPosts)
    }
    async getAllPostsForUser(paginationPosts: PaginationTypeInputPosts, user:IUser): Promise<inputSortDataBaseType<Post>> {

        return await this.postsRepository.getPostsForUser(paginationPosts,user)
    }

    async getPost(id: string): Promise<IPost | null> {
        return await this.postsRepository.getPost(id)
    }
    async getPostForUser(id: string,user:IUser): Promise<Post | false> {
        return await this.postsRepository.getPostForUser(id,user)
    }

    //aggregate root
    async createPost(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string,
                     blogIdForPost: string, blogNameForPost: string): Promise<string> {
        const idNewPost = randomUUID();
        const postsLikesInfo:LikesInfoPosts = new LikesInfoPosts(0,0,likeStatus.None)

        const newPost: IPost = new Post(idNewPost,
            titleNewPost,
            shortDescriptionNewPost,
            contentNewPost, blogIdForPost,
            blogNameForPost,
            new Date().toISOString(),
            postsLikesInfo)
        const addNewPost = await this.postsRepository.createPost(newPost)

        return idNewPost;
    }
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<string|null> {
        const blogNameForPost = await this.postsRepository.findBlogName(blogId);
        if (!blogNameForPost) {
            return null;
        }
        const idCreatePost = await this.createPost(pagination.titlePost, pagination.shortDescriptionPost,
            pagination.contentPost, blogId, blogNameForPost.name)

    return idCreatePost
    }
    async updatePostOnId(id: string, pagination:PaginationTypeInputPostValueForPost,blogId:string): Promise<boolean> {
        return await this.postsRepository.updatePost(id,pagination,blogId)
    }

    async changeCountLikeStatusUser(post: Post, user: IUser, newLikeStatus: likeStatus) {
        const newReaction: IReaction = this.createReaction(post.id, user.id, user.login, newLikeStatus)
        console.log(newReaction)
        const updateReaction = await this.postsRepository.updateLikeStatusPost(post, newReaction)
        return updateReaction
    }
}

