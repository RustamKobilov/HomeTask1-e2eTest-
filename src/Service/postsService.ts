import {randomUUID} from "crypto";
import {
    inputSortDataBaseType,
    PaginationTypeGetInputCommentByPost, PaginationTypeInputPosts,
    PaginationTypeInputPostValueForPost, Post, PostsRepository,
} from "../RepositoryInDB/posts-repositoryDB";
import {
    Comment,
    CommentatorInfo
} from "../RepositoryInDB/comments-repositoryDB";
import {User} from "../RepositoryInDB/user-repositoryDB";
import {CommentsService} from "./commentsService";

export class PostsService{
    private postRepository: PostsRepository
    private commentService = new CommentsService
    constructor() {
        this.postRepository = new PostsRepository()
        this.commentService = new CommentsService()
    }
    async getAllPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<Post>> {
        return await this.postRepository.getPosts(paginationPosts)
    }
    async findPostOnId(id: string): Promise<Post | null> {
        return await this.postRepository.findPost(id)
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
        const addNewPost = await this.postRepository.createPost(newPost)

        return addNewPost;
    }
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<Post|boolean> {
        const blogNameForPost = await this.postRepository.findBlogName(blogId);

        if (!blogNameForPost) {
            return false;
        }
        const resultCreatePost = await this.createPost(pagination.titlePost, pagination.shortDescriptionPost,
            pagination.contentPost, blogId, blogNameForPost.name)
    return resultCreatePost
    }
    async updatePostOnId(id: string, pagination:PaginationTypeInputPostValueForPost,blogId:string): Promise<boolean> {
        return await this.postRepository.updatePost(id,pagination,blogId)
    }
    async createCommentOnId(pagination:PaginationTypeGetInputCommentByPost, user:User){
        const idNewComment = randomUUID();
        const CommentatorInfoNewComment:CommentatorInfo= new CommentatorInfo(user.id,user.login)

        const newComment: Comment = new Comment(pagination.idPost,
                                                idNewComment,
                                                pagination.content,
                                                CommentatorInfoNewComment,
                                                new Date().toISOString())

        const addNewComment=await this.commentService.createCommentByPost(newComment)
        return addNewComment
    }
}

