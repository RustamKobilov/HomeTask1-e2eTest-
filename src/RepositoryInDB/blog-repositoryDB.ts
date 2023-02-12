import {blogsCollection, postsCollection} from "../db";
import {randomUUID} from "crypto";
import {Filter} from "mongodb";
import {inputPostsType, PaginationTypeInputPosts, PostType} from "./posts-repositiryDB";
import {countPageMath, ReturnDistributedDate, skipPageMath, valueSortDirection} from "./jointRepository";

export type BlogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PaginationTypeInputParamsBlogs = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}


export async function getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):
    Promise<ReturnDistributedDate<BlogsType>> {
    console.log(paginationBlogs)
    const totalCountBlog = paginationBlogs.searchNameTerm != null ?
        await blogsCollection.countDocuments({name: {$regex: paginationBlogs.searchNameTerm, $options: "$i"}}) :
        await blogsCollection.countDocuments({})

    const filterFindBlog = paginationBlogs.searchNameTerm != null ?
        blogsCollection.find({name: {$regex: paginationBlogs.searchNameTerm, $options: "$i"}}) :
        blogsCollection.find({})

    const pagesCountBlog = countPageMath(totalCountBlog, paginationBlogs.pageSize)
    const skipPage = skipPageMath(paginationBlogs.pageNumber, paginationBlogs.pageSize)

    const blogs = await filterFindBlog.sort({[paginationBlogs.sortBy]: valueSortDirection(paginationBlogs.sortDirection)}).skip(skipPage).limit(paginationBlogs.pageSize).project<BlogsType>({_id: 0}).toArray()

    return {
        pagesCount: pagesCountBlog, page: paginationBlogs.pageNumber, pageSize: paginationBlogs.pageSize,
        totalCount: totalCountBlog, items: blogs
    }
}


export async function createBlog(nameNewBlog: string, descriptionNewBlog: string, websiteUrlNewBlog: string): Promise<BlogsType> {
    const newId = randomUUID();
    const newBlog: BlogsType = {
        id: newId,
        name: nameNewBlog,
        description: descriptionNewBlog,
        websiteUrl: websiteUrlNewBlog,
        createdAt: new Date().toISOString(),
        isMembership: false
    }
    return newBlog;
}

export async function getAllPostsForBlogInBase(paginationPosts: PaginationTypeInputPosts, blogId: string):
    Promise<inputPostsType<PostType>> {

    const filter: Filter<PostType> = {blogId: blogId}
    const countPostsForBlog = await postsCollection.countDocuments(filter)
    console.log(paginationPosts)

    const skipPage = skipPageMath(paginationPosts.pageNumber, paginationPosts.pageSize);
    const countPage = countPageMath(countPostsForBlog, paginationPosts.pageSize)

    let sortPostsForBlogs = await postsCollection.find(filter).sort({[paginationPosts.sortBy]: valueSortDirection(paginationPosts.sortDirection)}).skip(skipPage).limit(paginationPosts.pageSize).project<PostType>({_id: 0}).toArray()

    return {
        pagesCount: countPage,
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


