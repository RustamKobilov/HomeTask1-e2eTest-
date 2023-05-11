import {inputSortDataBaseType, PaginationTypeInputPosts, Post} from "./posts-repositoryDB";
import {helper, ReturnDistributedDate} from "./helper";
import {BlogModel, PostModel} from "../Models/shemaAndModel";


export class Blog {
    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}



export type PaginationTypeInputParamsBlogs = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1 | -1
}


export const blogRepository={
    async getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):
        Promise<ReturnDistributedDate<Blog>> {

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
    },
    async getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
        Promise<inputSortDataBaseType<Post>> {


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
    },
    async findBlogOnId(id: string): Promise<Blog | null> {
        let blog = await BlogModel.findOne({id: id}, {_id: 0, __v: 0});
        console.log(blog + ' result search blog for delete')
        return blog;
    },
    async updateBlogOnId(id: string, newName: string, newDescription: string, newWebsiteUrl: string):
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

}

