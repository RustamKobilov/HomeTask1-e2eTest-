import {inputSortDataBaseType, PaginationTypeInputPosts, PostType} from "./posts-repositiryDB";
import {helper, ReturnDistributedDate} from "./helper";
import {BlogModel, PostModel} from "../shemaAndModel";


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

    const filter={name: {$regex: paginationBlogs.searchNameTerm ?? '', $options: "i"}}

    const totalCountBlog =  await BlogModel.countDocuments(filter)

    const sortBy=paginationBlogs.sortBy
    const sortDirection=paginationBlogs.sortDirection
    const paginationFromHelperForBlogs=helper.getPaginationFunctionSkipSortTotal(paginationBlogs.pageNumber,paginationBlogs.pageSize, totalCountBlog)

    const blogs = await BlogModel.find(filter, {_id: 0, __v: 0}).sort({[sortBy]: sortDirection})
        .skip(paginationFromHelperForBlogs.skipPage)
        .limit(paginationBlogs.pageSize).lean()

    return {
        pagesCount: paginationFromHelperForBlogs.totalCount, page: paginationBlogs.pageNumber, pageSize: paginationBlogs.pageSize,
        totalCount: totalCountBlog, items: blogs
    }
}


export async function getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
    Promise<inputSortDataBaseType<PostType>> {


    const filter= {blogId: blogId}
    const countPostsForBlog = await PostModel.countDocuments(filter)
    const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, countPostsForBlog)

    let sortPostsForBlogs = await PostModel.find(filter, {_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
    skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

    return {
        pagesCount: paginationFromHelperForPosts.totalCount,
        page: paginationPosts.pageNumber,
        pageSize: paginationPosts.pageSize,
        totalCount: countPostsForBlog,
        items: sortPostsForBlogs
    }
}

export async function findBlogOnId(id: string): Promise<BlogsType | null> {
    let blog = await BlogModel.findOne({id: id}, {_id: 0, __v: 0});
    console.log(blog + ' result search blog for delete')
    return blog;
}

export async function updateBlogOnId(id: string, newName: string, newDescription: string, newWebsiteUrl: string):
    Promise<boolean> {
    let blog = await BlogModel.updateOne({id: id}, {
        $set: {
            name: newName,
            websiteUrl: newWebsiteUrl,
            description: newDescription
        }
    })
    console.log(blog.matchedCount  + ' result update blog')
    return blog.matchedCount === 1
}


