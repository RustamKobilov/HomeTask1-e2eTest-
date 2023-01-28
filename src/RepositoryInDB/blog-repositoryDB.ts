import {client} from "../db";
import {match} from "assert";

export type BlogsType={
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt:string
}
export let dbBlogs : Array<BlogsType> =[{
    id: '1234',
    name: 'string1',
    description: 'string1',
    websiteUrl: 'string2',
    createdAt:'string2'
},{
    id: '1234554',
    name: 'string133553',
    description: 'string12323233',
    websiteUrl: 'string235351',
    createdAt: 'string12323233'
}]



export async function findBlogOnId(id:string):Promise<BlogsType|undefined>{
    let blog= await client.db('hometask3').collection('Blogs').findOne({id:id},{_id:0});
    return blog;
}

export async function updateBlogOnId(id:string,newName:string,newDescription:string,newWebsiteUrl:string):
Promise<boolean>{
    let blog=await client.db('hometask').collection('Blogs').
    UpdateOne({id:id},{set:{name:newName,websiteUrl:newWebsiteUrl,description:newDescription}})
    return blog.matchedCount ===1
}
