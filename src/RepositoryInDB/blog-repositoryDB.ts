import {blogsCollection, postsCollection} from "../db";
import {randomUUID} from "crypto";
import {Filter} from "mongodb";
import {inputPostsType, PostType} from "./posts-repositiryDB";
import {countPageMath, skipPageMath, valueSortDirection} from "./jointRepository";
import {PaginationTypeInputParamsBlogs} from "../routse/blogs-router";

export type BlogsType={
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMemberShip:boolean
}

export type OutputBlogsType={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogsType[]
}
const output: OutputBlogsType<BlogsType> = {
    pagesCount: 1,
    totalCount:1,
    page: 1,
    pageSize: 1,
    items: []
}
//как типизировать items в блог?если он документ дает

export async function getAllBlog(paginationBlogs: PaginationTypeInputParamsBlogs):
    Promise<OutputBlogsType>{
console.log(paginationBlogs)
    const totalCountBlog = paginationBlogs.searchNameTerm!=null?
        await blogsCollection.countDocuments({name: {$regex: paginationBlogs.searchNameTerm, $options: "$i"}}):
        await blogsCollection.countDocuments({})

    const filterFindBlog=paginationBlogs.searchNameTerm!=null?
        blogsCollection.find({name: {$regex: paginationBlogs.searchNameTerm, $options: "$i"}}):
        blogsCollection.find({})

        const pagesCountBlog=countPageMath(totalCountBlog,paginationBlogs.pageSize)
        const skipPage=skipPageMath(paginationBlogs.pageNumber,paginationBlogs.pageSize)
    //console.log(skipPage)
        const blogs = await filterFindBlog.sort({[paginationBlogs.sortBy]:valueSortDirection(paginationBlogs.sortDirection)}).skip(skipPage).
        limit(paginationBlogs.pageSize).project<BlogsType>({_id: 0}).toArray()
    //
        console.log(blogs)
        return { pagesCount: pagesCountBlog, page: paginationBlogs.pageNumber, pageSize: paginationBlogs.pageSize,
            totalCount: totalCountBlog, items: blogs}
    }


export async function createBlog(nameNewBlog:string,descriptionNewBlog:string,websiteUrlNewBlog:string):Promise<BlogsType>{
    const newId=randomUUID();
    const newBlog:BlogsType={
        id:newId,name:nameNewBlog,description:descriptionNewBlog,websiteUrl:websiteUrlNewBlog,createdAt:new Date().toISOString(),
        isMemberShip:true
    }
    return newBlog;
}

export async function getAllPostsForBlogInBase(pageNumber:number,pageSize:number,sortBy:string,sortDirection:string,blogId:string):
    Promise<inputPostsType> {
    const filter: Filter<PostType> = {blogId: blogId}
    //console.log(countPostsForBlog)
    const countPostsForBlog = await postsCollection.countDocuments(filter)

    const skipPage = skipPageMath(pageNumber,pageSize);
    const countPage = countPageMath(countPostsForBlog,pageSize)//количество страниц получаемое

    let sortPostsForBlogs = await postsCollection.find(filter).sort({[sortBy]: valueSortDirection(sortDirection)}).
    skip(skipPage).limit(pageSize).project({_id: 0}).toArray()

    console.log(sortPostsForBlogs)
    return {
        pagesCount: countPage,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: countPostsForBlog,
        items: sortPostsForBlogs
    }
}

export async function findBlogOnId(id:string):Promise<BlogsType|null>{
    let blog= await blogsCollection.findOne({id:id},{projection:{_id:0}});
    console.log(blog)
    return blog;
}



export async function updateBlogOnId(id:string,newName:string,newDescription:string,newWebsiteUrl:string):
Promise<boolean>{
    let blog=await blogsCollection.updateOne({id:id},{$set:{name:newName,websiteUrl:newWebsiteUrl,description:newDescription}})
    console.log(blog)
    return blog.matchedCount ===1
}


