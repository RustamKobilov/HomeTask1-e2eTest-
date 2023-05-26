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
    OutputCommentOutputType
} from "../RepositoryInDB/comment-repositoryDB";
import {User} from "../RepositoryInDB/user-repositoryDB";
import {randomUUID} from "crypto";
import {likeStatus} from "../Models/Enums";
import {
    IComment,
    ICommentatorInfo,
    ILikesInfo,
    IReaction,
    IUser,
} from "../Models/shemaAndModel";

export class CommentService {
    constructor(protected commentsRepository : CommentRepository){}
    private createReaction(parentId: string, userId: string, userLogin:string, status: likeStatus): IReaction {
        return {
            parentId,
            userId,
            userLogin,
            status,
            createdAt: new Date().toISOString()
        }
    }

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
        const commentatorInfoNewComment:ICommentatorInfo= new CommentatorInfo(user.id,user.login)
        const commentLikesInfo:ILikesInfo = new LikesInfo(0,0,likeStatus.None)

        const newComment: IComment = new Comment(
            pagination.idPost,
            idNewComment,
            pagination.content,
            commentatorInfoNewComment,
            new Date().toISOString(),
            commentLikesInfo
            )
        console.log(newComment)
        const addNewComment=await this.commentsRepository.createCommentForPost(newComment)
        return addNewComment
    }
    async getCommentOnIdForUser(id:string,user:IUser):Promise<Comment|null> {
            return this.commentsRepository.getCommentForUser(id,user)
    }
    async getAllCommentForPostInBaseForUser(pagination:PaginationTypePostInputCommentByPost):
        Promise<inputSortDataBaseType<OutputCommentOutputType>>{
        return await this.commentsRepository.getCommentsForUser(pagination)
    }
    async changeCountLikeStatusUser(comment: Comment, user: IUser, newLikeStatus: likeStatus): Promise<boolean> {
        const newReaction: IReaction = this.createReaction(comment.id, user.id, user.login, newLikeStatus)
        const updateReaction = await this.commentsRepository.updateLikeStatusComment(comment, newReaction)
        return updateReaction

    }
}



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