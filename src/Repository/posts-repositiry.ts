import {dbBlogs} from "./blog-repository";
import {randomUUID} from "crypto";

export let dbPosts : Array<any> =[
{
    "id": 2,
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "string",
    "blogName": "string"
},
    { "id": 3,
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "string",
    "blogName": "string"}]

export const postInputModel=(title:string,shortDescription:string,content:string,blogId:string)=>{
    const id= randomUUID();
    const blogName='blog name who is?'
    return {id,title,shortDescription,content,blogId,blogName}

}

export const findPostOnId=(id:string)=>{
    let post=dbPosts.find(s=> s.id===id);
    return post;
}
