import {blogsCollection, postsCollection} from "../db";
import {randomUUID} from "crypto";
import {Filter, SortDirection} from "mongodb";
import {inputSortDataBaseType, PaginationTypeInputPosts, PostType} from "./posts-repositiryDB";
import {helper, ReturnDistributedDate} from "./helper";

export type BlogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PaginationTypeInputParamsBlogs = {
    searchNameTerm: string|null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1 | -1
}


export async function getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):
    Promise<ReturnDistributedDate<BlogsType>> {
    console.log(paginationBlogs)
    //TODO если упало - поменять
    const filter: Filter<BlogsType> = {name: {$regex: paginationBlogs.searchNameTerm ?? '', $options: "$i"}}

    const totalCountBlog =  await blogsCollection.countDocuments(filter)

    const filterFindBlog = await blogsCollection.find(filter)

    const paginationFromHelperForBlogs=helper.getPaginationFunctionSkipSortTotal(paginationBlogs.pageNumber,paginationBlogs.pageSize, totalCountBlog)

    const blogs = await filterFindBlog.sort({[paginationBlogs.sortBy]: paginationBlogs.sortDirection}).skip(paginationFromHelperForBlogs.skipPage).limit(paginationBlogs.pageSize).project<BlogsType>({_id: 0}).toArray()

    return {
        pagesCount: paginationFromHelperForBlogs.totalCount, page: paginationBlogs.pageNumber, pageSize: paginationBlogs.pageSize,
        totalCount: totalCountBlog, items: blogs
    }
}


export async function getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
    Promise<inputSortDataBaseType<PostType>> {


    const filter: Filter<PostType> = {blogId: blogId}
    const countPostsForBlog = await postsCollection.countDocuments(filter)
    const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, countPostsForBlog)

    let sortPostsForBlogs = await postsCollection.find(filter).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
    skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).project<PostType>({_id: 0}).toArray()

    return {
        pagesCount: paginationFromHelperForPosts.totalCount,
        page: paginationPosts.pageNumber,
        pageSize: paginationPosts.pageSize,
        totalCount: countPostsForBlog,
        items: sortPostsForBlogs
    }
}

export async function findBlogOnId(id: string): Promise<BlogsType | null> {
    let blog = await blogsCollection.findOne({id: id}, {projection: {_id: 0}});
    console.log(blog)
    return blog;
}

export async function updateBlogOnId(id: string, newName: string, newDescription: string, newWebsiteUrl: string):
    Promise<boolean> {
    let blog = await blogsCollection.updateOne({id: id}, {
        $set: {
            name: newName,
            websiteUrl: newWebsiteUrl,
            description: newDescription
        }
    })
    console.log(blog)
    return blog.matchedCount === 1
}


