import {BlogsType, dbBlogs} from "./blog-repositoryDB";
import {randomUUID} from "crypto";
import {client} from "../db";

export type PostType={
    id: string
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
    createdAt:string
}
export let dbPosts : Array<PostType> =[
{
    "id": '2',
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "string",
    "blogName": "string",
    "createdAt":"string"
},
    { "id": '3',
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "string",
    "blogName": "string",
        "createdAt":"string111"
    }]


export async function findPostOnId(id:string):Promise<PostType|undefined>{
    let post=await client.db('hometask3').collection('Posts').findOne({id:id});
    return post;
    }


export async function updatePostOnId(id:string,newTittle:string, newShortDescription:string,newContent:string,newBlogId:string):Promise<boolean>{
    let post=await client.db('hometask3').collection('Posts').updateOne({id:id},{$set:{title:newTittle,shortDescription:newShortDescription,content:newContent,blogId:newBlogId}});
    //console.log(post.matchedCount)
    return post.matchedCount===1
}

export async function findBlogName(id:string):Promise<BlogsType|undefined>{
    const blog=await client.db('hometask3').collection('Blogs').findOne({id:id})
    return blog;
}
