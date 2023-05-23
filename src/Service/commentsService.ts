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
    OutputCommentOutputType,
    UsersLikeStatusLikesInfo
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
    async changeCountLikeStatusUser(comment:Comment,userId:string,newLikeStatus:string){
        const resultStatusUser = comment.likesInfo.usersStatus.filter(function (value){
            return value.userId == userId
        })
        console.log(resultStatusUser)
        console.log(resultStatusUser.length)

        const usersLikeStatus:UsersLikeStatusLikesInfo=new UsersLikeStatusLikesInfo(userId,newLikeStatus)
        if(resultStatusUser.length===0){

          if(newLikeStatus !== likeStatus.None){
             return await this.commentsRepository.updateCountLikesAndDislikes(usersLikeStatus,comment.id)
          }
           return await this.commentsRepository.updateUsersStatusByComment(usersLikeStatus,comment.id)
        }
        console.log('dashlo')
        console.log(comment.likesInfo.myStatus + ' oldStatus')
        console.log(newLikeStatus + ' nesStatus')
        console.log(comment.likesInfo.myStatus!==newLikeStatus)
        console.log('zahlo')

        if(comment.likesInfo.myStatus!==newLikeStatus){
            console.log('status update')
            const oldUsersLikeStatus = comment.likesInfo.myStatus
            if(comment.likesInfo.myStatus===likeStatus.None) {

                return await this.commentsRepository.updateUsersStatusRepeatedByComment(oldUsersLikeStatus, usersLikeStatus, comment.id)
            }
            return await  this.commentsRepository.updateUsersStatusRepeateEditCountdByComment(oldUsersLikeStatus, usersLikeStatus, comment.id)
        }


    }
}