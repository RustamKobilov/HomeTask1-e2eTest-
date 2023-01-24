import {dbBlogs} from "./blog-repositoryDB";
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


export async function findPostOnId(id:string):Promise<any>{
    let post=dbPosts.find(s=> s.id===id);
    if(post!=undefined) {
        return post;
    }
}

export async function updatePostOnId(id:string,newTittle:string,
                                     newShortDescription:string,newContent:string,newBlogId:string):Promise<boolean>{
    let post=dbPosts.find(s=> s.id===id);
    if(post){
        post.title=newTittle,
            post.shortDescription=newShortDescription,
            post.content=newContent,
            post.blogId=newBlogId
        return true
    }
    else {
        return false
    }
}

export async function findBlogName(id:string):Promise<any>{
    //let blog=dbBlogs.find(s=> s.id===id);
    const blog=await dbBlogs.find(value => value.id==id)
    if(blog!=undefined) {
        return blog;
    }

}
