import {
    inputSortDataBaseType,
    PaginationTypeGetInputCommentByPost,
    PaginationTypePostInputCommentByPost
} from "../RepositoryInDB/post-repositoryDB";
import {
    Comment,
    CommentatorInfo,
    CommentRepository,
    LikesInfo,
    OutputCommentOutputType, UsersLikeStatusLikesInfo
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
        const commentatorInfoNewComment:CommentatorInfo= new CommentatorInfo(user.id,user.login)
        const userStatusLikesInfo:UsersLikeStatusLikesInfo = new UsersLikeStatusLikesInfo(user.id,likeStatus.None)
        const likesAndDislikeNewComment : LikesInfo = new LikesInfo(0,0,likeStatus.None
            ,[userStatusLikesInfo])

        console.log(commentatorInfoNewComment)
        console.log(likesAndDislikeNewComment)


        const newComment: Comment = new Comment(
            pagination.idPost,
            idNewComment,
            pagination.content,
            commentatorInfoNewComment,
            new Date().toISOString(),
            likesAndDislikeNewComment)


        console.log(newComment)

        const addNewComment=await this.commentsRepository.createCommentForPost(newComment)
        return addNewComment
    }
    async changeCountLikeStatusUser(comment:Comment,userId:string,likeStatus:string){
        const resultStatusUser = comment.likesInfo.usersStatus.filter(function (value){
            console.log(value)
            return value.userId == userId
        })
        console.log(resultStatusUser)
        console.log(resultStatusUser.length)
        const usersLikeStatus:UsersLikeStatusLikesInfo=new UsersLikeStatusLikesInfo(userId,likeStatus)
        if(resultStatusUser.length===0){
          await this.updateLikeStatus(usersLikeStatus,comment.id)
        }

    }
    async updateLikeStatus(usersLikeStatus:UsersLikeStatusLikesInfo,commentId:string):Promise<boolean> {
        return await this.commentsRepository.updateCountLikesAndDislikes(usersLikeStatus,commentId)
    }
}