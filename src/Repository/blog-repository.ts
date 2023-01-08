export let dbBlogs : Array<any> =[{
    "id": 1,
    "name": "string1",
    "description": "string1",
    "websiteUrl": "string2"
},{
    "id": 2,
    "name": "string3",
    "description": "string3",
    "websiteUrl": "string3"
}]

export const blogInputModel=(name:string,description:string,websiteUrl:string)=>{
    const id= new Date().toISOString();
    return {id,name,description,websiteUrl,}
}
export const findBlogOnId=(id:number)=>{
    let blog=dbBlogs.find(s=> s.id===id);
    return blog;
}
