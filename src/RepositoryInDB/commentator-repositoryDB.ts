import {commentsCollection, postsCollection} from "../db";
import {Filter} from "mongodb";
import {inputSortDataBaseType, PaginationTypePostInputCommentByPost, PostType} from "./posts-repositiryDB";
import {helper} from "./helper";

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

export async function getAllCommentForPostInBase(pagination:PaginationTypePostInputCommentByPost):
    Promise<inputSortDataBaseType<CommentType>>{
    const filter: Filter<CommentType> = {postId: pagination.idPost}
    const countCommentsForPost = await commentsCollection.countDocuments(filter)
    const paginationFromHelperForComments=helper.getPaginationFunctionSkipSortTotal(pagination.pageNumber,pagination.pageSize, countCommentsForPost)

    let sortCommentsForPosts = await commentsCollection.find(filter).sort({[pagination.sortBy]: pagination.sortDirection}).
    skip(paginationFromHelperForComments.skipPage).limit(pagination.pageSize).project<CommentType>({_id: 0}).toArray()

    return {
        pagesCount: paginationFromHelperForComments.totalCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: countCommentsForPost,
        items: sortCommentsForPosts
    }
}

export async function createCommentByPost(comment:CommentType):Promise<OutputCommentOutputType>{
    await commentsCollection.insertOne(comment)

    return({id: comment.id,
        content: comment.content,
        commentatorInfo:comment.commentatorInfo,
        createdAt: comment.createdAt})
}
export async function getCommentOnId(id:string):Promise<CommentType|null>{
    const result=await commentsCollection.findOne({id: id}, {projection: {_id: 0,postId:0}});
    return result
}

export async function updateComment(id:string,content:string):Promise<boolean>{
     const commentUpdate =await commentsCollection.updateOne({id:id},{
         $set:{
             content:content
         }
     })

    return commentUpdate.matchedCount === 1
}