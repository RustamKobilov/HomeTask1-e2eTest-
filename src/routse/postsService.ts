import {randomUUID} from "crypto";
import {
    PaginationTypeGetInputCommentByPost,
    PaginationTypeInputPostValueForPost, postsRepository,
    PostType
} from "../RepositoryInDB/posts-repositoryDB";
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import {CommentatorInfo, commentsRepository, CommentType} from "../RepositoryInDB/comments-repositoryDB";

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
        const addNewPost=await postsRepository.createPostOnId(newPost)

        return addNewPost;
    },
    async createPostOnId(pagination:PaginationTypeInputPostValueForPost,blogId:string):Promise<PostType|boolean> {
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

        const newComment: CommentType = {
            postId:pagination.idPost,
            id: idNewComment,
            content: pagination.content,
            commentatorInfo:<CommentatorInfo>{
              userId:user.id,
              userLogin:user.login
            },
            createdAt: new Date().toISOString()
        };
        const addNewComment=await commentsRepository.createCommentByPost(newComment)
        return addNewComment
    }
}