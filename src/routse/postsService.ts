import {randomUUID} from "crypto";
import {
    PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPostValueForPost, Post, postsRepository,
} from "../RepositoryInDB/posts-repositoryDB";
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import {Comment, CommentatorInfo, commentsRepository} from "../RepositoryInDB/comments-repositoryDB";

export const postsService={
    async createPost(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string,
                     blogIdForPost: string, blogNameForPost: string): Promise<Post> {
        const idNewPost = randomUUID();

        const newPost: Post = new Post(idNewPost,
            titleNewPost,
            shortDescriptionNewPost,
            contentNewPost, blogIdForPost,
            blogNameForPost,
            new Date().toISOString())
        const addNewPost = await postsRepository.createPostOnId(newPost)

        return addNewPost;
    },
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<Post|boolean> {
        const blogNameForPost = await postsRepository.findBlogName(blogId);

        if (!blogNameForPost) {
            return false;
        }
        const resultCreatePost = await postsService.createPost(pagination.titlePost, pagination.shortDescriptionPost,
            pagination.contentPost, blogId, blogNameForPost.name)
    return resultCreatePost
    },
    async createCommentOnId(pagination:PaginationTypeGetInputCommentByPost, user:UserType){
        const idNewComment = randomUUID();
        const CommentatorInfoNewComment:CommentatorInfo= new CommentatorInfo(user.id,user.login)

        const newComment: Comment = new Comment(pagination.idPost,
                                                idNewComment,
                                                pagination.content,
                                                CommentatorInfoNewComment,
                                                new Date().toISOString())

        const addNewComment=await commentsRepository.createCommentByPost(newComment)
        return addNewComment
    }
}