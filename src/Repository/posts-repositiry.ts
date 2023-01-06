import {dbBlogs} from "./blog-repository";

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

export const postInputModel=(title:string,shortdescription:string,content:string,blogId:string)=>{
    const idModelPost=dbBlogs.length;
    const blogName='blog name who is?'
    return {idModelPost,title,shortdescription,content,blogId,blogName}

}

export const findPostOnId=(id:number)=>{
    let post=dbPosts.find(s=> s.id===id);
    return post;
}