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
import {CommentModel, EReactionStatus, IReaction, ReactionModel} from "../Models/shemaAndModel";

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

    private createReaction(parentId: string, userId: string, status: EReactionStatus): IReaction {
        return {
            parentId,
            userId,
            status,
            createdAt: new Date().toISOString()
        }
    }

    async changeCountLikeStatusUser(comment:Comment,userId:string,newLikeStatus:EReactionStatus):Promise<boolean>{
        const newReaction: IReaction = this.createReaction(comment.id, userId, newLikeStatus)
        await ReactionModel.updateOne({parentId: comment.id}, {$set: {newReaction}}, {upsert: true})
        const likesCount = await ReactionModel.countDocuments({parentId: comment.id, status: EReactionStatus.Like})
        const dislikesCount = await ReactionModel.countDocuments({parentId: comment.id, status: EReactionStatus.Dislike})
        return true
        // const resultStatusUser = comment.likesInfo.usersStatus.filter(function (value){
        //     return value.userId == userId
        // })
        //
        // const usersLikeStatus:UsersLikeStatusLikesInfo=new UsersLikeStatusLikesInfo(userId,newLikeStatus)
        // if(resultStatusUser.length===0){
        //
        //   if(newLikeStatus !== likeStatus.None){
        //      return await this.commentsRepository.updateCountLikesAndDislikes(usersLikeStatus,comment.id)
        //   }
        //    return await this.commentsRepository.updateUsersStatusByComment(usersLikeStatus,comment.id)
        // }
        //
        // if(comment.likesInfo.myStatus!==newLikeStatus){
        //
        //     const oldUsersLikeStatus = comment.likesInfo.myStatus
        //     if(comment.likesInfo.myStatus===likeStatus.None) {
        //         return await this.commentsRepository.updateUsersStatusNeitralByComment(oldUsersLikeStatus, usersLikeStatus, comment.id)
        //     }
        //     if(usersLikeStatus.likeStatus===likeStatus.None){
        //         return await this.commentsRepository.updateUsersStatusInNeitralByComment(oldUsersLikeStatus, usersLikeStatus, comment.id)
        //     }
        //     return await  this.commentsRepository.updateUsersStatusRepeateEditCountdByComment(oldUsersLikeStatus, usersLikeStatus, comment.id)
        // }
        // return true

    }
}