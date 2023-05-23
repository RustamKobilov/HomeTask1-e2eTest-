import {inputSortDataBaseType, PaginationTypePostInputCommentByPost} from "./post-repositoryDB";
import {helper} from "../Service/helper";
import {CommentModel} from "../Models/shemaAndModel";
import {likeStatus} from "../Models/Enums";


export type InputCommentByIdType ={
    id:string
}

export type InputUpdateLikeStatusCommentByIdType ={
    id:string,
    likeStatus:string
}

export class Comment {
    constructor(public postId:string,
                public id:string,
                public content:string,
                public commentatorInfo:CommentatorInfo,
                public createdAt:string,
                public likesInfo:LikesInfo){}
}

export class CommentatorInfo{
    constructor(public userId:string, public userLogin:string){}
}

export class UsersLikeStatusLikesInfo {
    constructor(public userId:string, public likeStatus:string) {}
}

export class LikesInfo {
    constructor (public likesCount :  number, public dislikesCount  : number, public myStatus :  likeStatus
    , public usersStatus: [UsersLikeStatusLikesInfo]){}
}



export type OutputCommentOutputType ={
    id:string
    content:string
    commentatorInfo:CommentatorInfo
    createdAt:string
}

export type UpdateCommentType ={
    id:string,
    content:string
}

export class CommentRepository {
    async getComments(pagination: PaginationTypePostInputCommentByPost):
        Promise<inputSortDataBaseType<OutputCommentOutputType>> {
        const filter = {postId: pagination.idPost}
        const countCommentsForPost = await CommentModel.countDocuments(filter)
        const paginationFromHelperForComments = helper.getPaginationFunctionSkipSortTotal(pagination.pageNumber, pagination.pageSize, countCommentsForPost)

        let sortCommentsForPosts = await CommentModel.find(filter, {
            _id: 0,
            __v: 0,
            commentatorInfo: {_id: 0, __v: 0},
            likesInfo: {_id: 0, __v: 0, usersStatus: 0}
        })
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(paginationFromHelperForComments.skipPage).limit(pagination.pageSize).lean()

        return {
            pagesCount: paginationFromHelperForComments.totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: countCommentsForPost,
            items: sortCommentsForPosts
        }
    }

    async createCommentForPost(comment: Comment) {
        await CommentModel.insertMany(comment)
    }

    async getComment(id: string): Promise<Comment | null> {
        return await CommentModel.findOne({id: id}, {_id: 0, __v: 0});
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        const commentUpdate = await CommentModel.updateOne({id: id}, {
            $set: {
                content: content
            }
        })
        return commentUpdate.matchedCount === 1
    }

    async updateCountLikesAndDislikes(usersLikeStatus: UsersLikeStatusLikesInfo, commentId: string): Promise<boolean> {
        console.log('input count one repeat')
        console.log(usersLikeStatus + ' status now ')
        console.log(commentId + ' comment id')
        console.log(usersLikeStatus.userId + ' userId')
        let countUsersStatus = 'likesInfo.'+usersLikeStatus.likeStatus + 'sCount'
        console.log(countUsersStatus)
        const updateLikeStatusByComment = await CommentModel.updateOne({id: commentId}, {

            $inc: {
                [countUsersStatus]: 1
            },
            $set: {
                'likesInfo.myStatus': usersLikeStatus.likeStatus,
            },
            $push: {
                'likesInfo.usersStatus': usersLikeStatus
            }
        })
        console.log(updateLikeStatusByComment.matchedCount)
        return updateLikeStatusByComment.matchedCount === 1
    }

    async updateUsersStatusByComment(usersLikeStatus: UsersLikeStatusLikesInfo, commentId: string): Promise<boolean> {
        console.log('input none one repeat')
        console.log(usersLikeStatus + ' status now ')
        console.log(commentId + ' comment id')
        console.log(usersLikeStatus.userId + ' userId')

        const updateLikeStatusByComment = await CommentModel.updateOne({id: commentId}, {

            $set: {
                'likesInfo.myStatus': usersLikeStatus.likeStatus,
            },
            $push: {
                'likesInfo.usersStatus': usersLikeStatus
            }
        })
        console.log(updateLikeStatusByComment.matchedCount)
        return updateLikeStatusByComment.matchedCount === 1
    }

    async updateUsersStatusRepeatedByComment(oldUsersLikeStatus: string, usersLikeStatus: UsersLikeStatusLikesInfo, commentId: string): Promise<boolean> {
        console.log('input void hardudtate !!!!!!!!!!!')
        console.log(oldUsersLikeStatus + ' oldStatus')
        console.log(usersLikeStatus.likeStatus + ' status now ')
        console.log(commentId + ' comment id')
        console.log(usersLikeStatus.userId + ' userId')
        let newStatusUserbyUser = 'likesInfo.usersStatus.' + usersLikeStatus.userId
        console.log(newStatusUserbyUser + ' newStatusUserbyUser')

        const updateLikeStatusByComment = await CommentModel.updateOne({id: commentId}, {

            $set: {
                'likesInfo.myStatus': usersLikeStatus.likeStatus,
                [newStatusUserbyUser]:usersLikeStatus.likeStatus
            },
            // $pull: {
            //     'likesInfo.usersStatus': {'userId': usersLikeStatus.userId}
            // }
            // ,
        })
        console.log(updateLikeStatusByComment.matchedCount)
        return updateLikeStatusByComment.matchedCount === 1
    }
    async updateUsersStatusRepeateEditCountdByComment(oldUsersLikeStatus: string, usersLikeStatus: UsersLikeStatusLikesInfo, commentId: string): Promise<boolean> {
        console.log('input void hardudtate but inc:-1 !!!!!!!!!!!!')
        console.log(oldUsersLikeStatus + ' oldStatus')
        console.log(usersLikeStatus.likeStatus + ' status now ')
        console.log(commentId + ' comment id')
        console.log(usersLikeStatus.userId + ' userId')
        let countOldStatusUser = 'likesInfo.' + oldUsersLikeStatus + 'sCount'
        console.log(countOldStatusUser + ' countOldStatusUser')
        let countNewStatusUser = 'likesInfo.' + usersLikeStatus.likeStatus + 'sCount'
        console.log(countNewStatusUser + ' countNewStatusUser')
        let newStatusUserbyUser = 'likesInfo.usersStatus.' + usersLikeStatus.userId
        console.log(newStatusUserbyUser + ' newStatusUserbyUser')

        const updateLikeStatusByComment = await CommentModel.updateOne({id: commentId}, {
            $inc: {
                [countOldStatusUser]: -1,
                [countNewStatusUser]: 1
            },
            $set: {
                'likesInfo.myStatus': usersLikeStatus.likeStatus,
                [newStatusUserbyUser]:usersLikeStatus.likeStatus
            }
            //ридумать как менять статус вложенного обьекта
            // ,
            // $push: {
            //     'likesInfo.usersStatus': usersLikeStatus
            // }
        })
        console.log(updateLikeStatusByComment.matchedCount)
        return updateLikeStatusByComment.matchedCount === 1
    }
}
