import {BlogsType, dbBlogs} from "./blog-repositoryDB";
import {blogsCollection,postsCollection, client} from "../db";
import {randomUUID} from "crypto";

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

export async function getAllPosts():Promise<PostType>{
    const Posts=await postsCollection.find({}).project({_id:0}).toArray();
    return Posts;
}
export async function createPost(titleNewPost:string,shortDescriptionNewPost:string,contentNewPost:string,
                                 blogIdForPost:string,blogNameForPost:string):Promise<PostType>{
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
export async function findPostOnId(id:string):Promise<PostType|null>{
    let post=await postsCollection.findOne({id:id},{projection:{_id:0}});
    return post;
    }


export async function updatePostOnId(id:string,newTittle:string, newShortDescription:string,newContent:string,newBlogId:string):Promise<boolean>{
    let post=await postsCollection.updateOne({id:id},{$set:{title:newTittle,shortDescription:newShortDescription,content:newContent,blogId:newBlogId}});
    //console.log(post.matchedCount)
    return post.matchedCount===1
}

export async function findBlogName(id:string):Promise<BlogsType|null>{
    return blogsCollection.findOne({id},{projection:{_id:0}});

}
