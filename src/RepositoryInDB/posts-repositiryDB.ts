import {BlogsType} from "./blog-repositoryDB";
import {randomUUID} from "crypto";
import { helper} from "./helper";
import {CommentatorInfo, OutputCommentOutputType, CommentType} from "./commentator-repositoryDB";
import {BlogModel, PostModel} from "../Models/shemaAndModel";

export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type inputSortDataBaseType<T> = {

    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type PaginationTypeInputPosts = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1|-1
}

export type PaginationTypeInputPostValueForPost={
    titlePost: string
    shortDescriptionPost: string
    contentPost: string
}

export type PaginationTypeGetInputCommentByPost ={
    idPost:string,
    content:string
}

export type PaginationTypePostInputCommentByPost={
    idPost:string,
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1|-1
}
export async function getAllPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<PostType>> {

    const pagesCountBlog = await PostModel.countDocuments({});

    const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, pagesCountBlog)

    const posts = await PostModel.find({},{_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
    skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

    return {
        pagesCount: paginationFromHelperForPosts.totalCount, page: paginationPosts.pageNumber, pageSize: paginationPosts.pageSize,
        totalCount: pagesCountBlog, items: posts
    };
}

export async function findPostOnId(id: string): Promise<PostType | null> {
    let post = await PostModel.findOne({id: id},{_id: 0, __v: 0});
    return post;
}


export async function updatePostOnId(id: string, pagination:PaginationTypeInputPostValueForPost,blogId:string): Promise<boolean> {
    let post = await PostModel.updateOne({id: id}, {
        $set: {
            title: pagination.titlePost,
            shortDescription: pagination.shortDescriptionPost,
            content: pagination.contentPost,
            blogId: blogId
        }
    });

    return post.matchedCount === 1
}

export async function findBlogName(id: string): Promise<BlogsType | null> {
    return BlogModel.findOne({id:id},{_id: 0, __v: 0});

}

export async function createPostOnId(resultCreatePost:PostType):
    Promise<PostType> {

    await PostModel.insertMany(resultCreatePost);

    return ({
        id: resultCreatePost.id, title: resultCreatePost.title,
        shortDescription: resultCreatePost.shortDescription, content: resultCreatePost.content,
        blogId: resultCreatePost.blogId, blogName: resultCreatePost.blogName, createdAt: resultCreatePost.createdAt
    })

}

