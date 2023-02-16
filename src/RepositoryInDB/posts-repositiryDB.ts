import {BlogsType} from "./blog-repositoryDB";
import {blogsCollection, postsCollection} from "../db";
import {randomUUID} from "crypto";
import {countPageMath, skipPageMath, valueSortDirection} from "./jointRepository";

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
    sortDirection: string
}


export async function getAllPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<PostType>> {

    const skipPage = skipPageMath(paginationPosts.pageNumber, paginationPosts.pageSize)
    const pagesCountBlog = await postsCollection.countDocuments({});
    const countPage = countPageMath(pagesCountBlog, paginationPosts.pageSize)

    const posts = await postsCollection.find({}).sort({
        [paginationPosts.sortBy]:
            valueSortDirection(paginationPosts.sortDirection)
    }).skip(skipPage).limit(paginationPosts.pageSize).project<PostType>({_id: 0}).toArray();

    return {
        pagesCount: countPage, page: paginationPosts.pageNumber, pageSize: paginationPosts.pageSize,
        totalCount: pagesCountBlog, items: posts
    };
}

export async function createPost(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string,
                                 blogIdForPost: string, blogNameForPost: string): Promise<PostType> {
    const idNewPost = randomUUID();

    const newPost: PostType = {
        id: idNewPost,
        title: titleNewPost,
        shortDescription: shortDescriptionNewPost,
        content: contentNewPost,
        blogId: blogIdForPost,
        blogName: blogNameForPost,
        createdAt: new Date().toISOString()
    };

    return newPost;
}

export async function findPostOnId(id: string): Promise<PostType | null> {
    let post = await postsCollection.findOne({id: id}, {projection: {_id: 0}});
    return post;
}


export async function updatePostOnId(id: string, newTittle: string, newShortDescription: string, newContent: string, newBlogId: string): Promise<boolean> {
    let post = await postsCollection.updateOne({id: id}, {
        $set: {
            title: newTittle,
            shortDescription: newShortDescription,
            content: newContent,
            blogId: newBlogId
        }
    });
    //console.log(post.matchedCount)
    return post.matchedCount === 1
}

export async function findBlogName(id: string): Promise<BlogsType | null> {
    return blogsCollection.findOne({id}, {projection: {_id: 0}});

}

export async function createPostOnId(titleNewPost: string, shortDescriptionNewPost: string, contentNewPost: string, blogIdForPost: string):
    Promise<PostType | boolean> {

    const blogNameForPost = await findBlogName(blogIdForPost);
    console.log(blogNameForPost)
    if (!blogNameForPost) {
        return false;
    }
    const resultCreatePost = await createPost(titleNewPost, shortDescriptionNewPost,
        contentNewPost, blogIdForPost, blogNameForPost.name)

    await postsCollection.insertOne(resultCreatePost);

    return ({
        id: resultCreatePost.id, title: resultCreatePost.title,
        shortDescription: resultCreatePost.shortDescription, content: resultCreatePost.content,
        blogId: resultCreatePost.blogId, blogName: resultCreatePost.blogName, createdAt: resultCreatePost.createdAt
    })

}