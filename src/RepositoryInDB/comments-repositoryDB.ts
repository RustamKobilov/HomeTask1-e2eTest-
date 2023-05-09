import {inputSortDataBaseType, PaginationTypePostInputCommentByPost} from "./posts-repositoryDB";
import {helper} from "./helper";
import {CommentModel} from "../Models/shemaAndModel";

export type CommentatorInfo={
    userId:string
    userLogin:string
}

export type InputCommentByIdType ={
    id:string
}

export type CommentType ={
    postId:string,
    id:string
    content:string
    commentatorInfo:CommentatorInfo
    createdAt:string
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

export const commentsRepository={
    async getAllCommentForPostInBase(pagination:PaginationTypePostInputCommentByPost):
        Promise<inputSortDataBaseType<OutputCommentOutputType>>{
        const filter= {postId: pagination.idPost}
        const countCommentsForPost = await CommentModel.countDocuments(filter)
        const paginationFromHelperForComments=helper.getPaginationFunctionSkipSortTotal(pagination.pageNumber,pagination.pageSize, countCommentsForPost)

        let sortCommentsForPosts = await CommentModel.find(filter,{_id: 0, __v: 0,commentatorInfo: {_id: 0, __v: 0}}).sort({[pagination.sortBy]: pagination.sortDirection}).
        skip(paginationFromHelperForComments.skipPage).limit(pagination.pageSize).lean()

        return {
            pagesCount: paginationFromHelperForComments.totalCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: countCommentsForPost,
            items: sortCommentsForPosts
        }
    },
     async createCommentByPost(comment:CommentType):Promise<OutputCommentOutputType>{
        await CommentModel.insertMany(comment)

        return({id: comment.id,
            content: comment.content,
            commentatorInfo:comment.commentatorInfo,
            createdAt: comment.createdAt})
    },
    async getCommentOnId(id:string):Promise<CommentType|null>{
        const result=await CommentModel.findOne({id: id}, {_id: 0, __v: 0});
        return result
    },
    async updateComment(id:string,content:string):Promise<boolean>{
        const commentUpdate =await CommentModel.updateOne({id:id},{
            $set:{
                content:content
            }
        })

        return commentUpdate.matchedCount === 1
    }
}

