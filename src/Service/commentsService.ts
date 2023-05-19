import {
    inputSortDataBaseType,
    PaginationTypeGetInputCommentByPost,
    PaginationTypePostInputCommentByPost
} from "../RepositoryInDB/post-repositoryDB";
import {
    Comment, CommentatorInfo,
    CommentRepository, LikesInfo,
    OutputCommentOutputType
} from "../RepositoryInDB/comment-repositoryDB";
import {User} from "../RepositoryInDB/user-repositoryDB";
import {randomUUID} from "crypto";
import {likeStatus} from "../Models/Enums";

export class CommentService {
    constructor(protected commentsRepository : CommentRepository){}
    async getAllCommentForPostInBase(pagination:PaginationTypePostInputCommentByPost):
        Promise<inputSortDataBaseType<OutputCommentOutputType>>{
        return await this.commentsRepository.getComments(pagination)
    }
    async getCommentOnId(id:string):Promise<Comment|null> {
        return this.commentsRepository.getComment(id)
    }
    async updateCommentOnId(id:string,content:string):Promise<boolean> {
        return await this.commentsRepository.updateComment(id,content)
    }
    async createCommentOnId(pagination:PaginationTypeGetInputCommentByPost, user:User){
        const idNewComment = randomUUID();
        const CommentatorInfoNewComment:CommentatorInfo= new CommentatorInfo(user.id,user.login)
        const likesAndDislikeNewComment : LikesInfo = new LikesInfo(0,0,likeStatus.None)

        const newComment: Comment = new Comment(
            pagination.idPost,
            idNewComment,
            pagination.content,
            CommentatorInfoNewComment,
            new Date().toISOString(),
            likesAndDislikeNewComment)

        const addNewComment=await this.commentsRepository.createCommentForPost(newComment)
        return addNewComment
    }
}