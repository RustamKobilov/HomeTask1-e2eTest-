import {Request,Response,Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";

import {createBlogValidation, errorFormatter, errorMessagesInputValidation, updateBlogValidation} from "../Models/InputValidation";
import {dbBlogs,BlogsType, findBlogOnId, updateBlogOnId} from "../RepositoryInDB/blog-repositoryDB";
import {randomUUID} from "crypto";
import {client} from "../db";

export const blogsRouter=Router({});

//const errors= [];
blogsRouter.get('/',async (req:Request,res:Response)=>{
    const result = await client.db('hometask3').collection('Blogs').find({}).toArray()
    return res.status(200).send(result)
    //cfefe
})

blogsRouter.get('/:id',async (req:Request,res:Response)=> {
    const findBlog = await findBlogOnId(req.params.id);
    if(findBlog){
       return res.status(200).send(findBlog)
    }
    return res.sendStatus(404)
})

blogsRouter.post('/', basicAuthMiddleware, createBlogValidation,errorMessagesInputValidation,
    async (req:Request,res:Response)=>{
    const newId= randomUUID();
    const nameNewBlog=req.body.name;
    const descriptionNewBlog=req.body.description;
    const websiteUrlNewBlog=req.body.websiteUrl;

    const newBlog:BlogsType={
        id:newId,name:nameNewBlog,description:descriptionNewBlog,websiteUrl:websiteUrlNewBlog,createdAt:new Date().toISOString()
    }
       await client.db('hometask3').collection('Blogs').insertOne(newBlog)
    dbBlogs.push(newBlog)
        return res.status(201).send(newBlog)

    })
blogsRouter.put('/:id',basicAuthMiddleware,updateBlogValidation,errorMessagesInputValidation,
    async (req:Request,res:Response)=>{

        const idBlog=req.params.id;
        const nameUpdateBlog=req.body.name;
        const descriptionUpdateBlog=req.body.description;
        const websiteUrlUpdateBlog=req.body.websiteUrl;

        const UpdateBlog = await updateBlogOnId(idBlog,nameUpdateBlog,descriptionUpdateBlog,websiteUrlUpdateBlog);
        if(!UpdateBlog){
            return res.sendStatus(404);
        }
        await client.db('hometask3').collection('Blogs').
        updateOne({id:idBlog},{$set:{name:nameUpdateBlog,description:descriptionUpdateBlog, websiteUrl:websiteUrlUpdateBlog}})

        return res.sendStatus(204);

    })

blogsRouter.delete('/:id',basicAuthMiddleware,
   async (req: Request, res: Response) => {

    const findDeleteBlog = await findBlogOnId(req.params.id);
    if (!findDeleteBlog) {
        return res.sendStatus(404);
    }
       await client.db('hometask3').collection('Blogs').deleteOne({id:findDeleteBlog.id})
    dbBlogs.splice(dbBlogs.indexOf(findDeleteBlog), 1)
    return res.sendStatus(204);
})