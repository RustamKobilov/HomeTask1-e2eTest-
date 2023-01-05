import {Request,Response} from "express";

const postInputModel=(title:string, shortDescription: string,content: string,blogId: string )=>{
    return {
        title,shortDescription,content,blogId
    }
}

const postViewModel=(id:string,title:string, shortDescription: string,content: string,
                     blogId: string, blogName:string )=>{
    return {
        id,title,shortDescription,content,blogId,blogName
    }
}
