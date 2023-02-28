import {BlogsType} from "./blog-repositoryDB";
import {blogsCollection, commentsCollection, postsCollection} from "../db";
import {randomUUID} from "crypto";
import { helper} from "./helper";
import {postsService} from "../routse/postsService";
import {CommentatorInfo, OutputCommentOutputType, CommentType} from "./commentator-repositoryDB";

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
export let dbPosts: Array<PostType> = [
    {
        "id": '2',
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "string",
        "blogName": "string",
        "createdAt": "string"
    },
    {
        "id": '3',
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "string",
        "blogName": "string",
        "createdAt": "string111"
    }]

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

    const pagesCountBlog = await postsCollection.countDocuments({});

    const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, pagesCountBlog)

    const posts = await postsCollection.find({}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
    skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).project<PostType>({_id: 0}).toArray();

    return {
        pagesCount: paginationFromHelperForPosts.totalCount, page: paginationPosts.pageNumber, pageSize: paginationPosts.pageSize,
        totalCount: pagesCountBlog, items: posts
    };
}

export async function findPostOnId(id: string): Promise<PostType | null> {
    let post = await postsCollection.findOne({id: id}, {projection: {_id: 0}});
    return post;
}


export async function updatePostOnId(id: string, pagination:PaginationTypeInputPostValueForPost,blogId:string): Promise<boolean> {
    let post = await postsCollection.updateOne({id: id}, {
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
    return blogsCollection.findOne({id}, {projection: {_id: 0}});

}

export async function createPostOnId(resultCreatePost:PostType):
    Promise<PostType> {

    await postsCollection.insertOne(resultCreatePost);

    return ({
        id: resultCreatePost.id, title: resultCreatePost.title,
        shortDescription: resultCreatePost.shortDescription, content: resultCreatePost.content,
        blogId: resultCreatePost.blogId, blogName: resultCreatePost.blogName, createdAt: resultCreatePost.createdAt
    })

}

