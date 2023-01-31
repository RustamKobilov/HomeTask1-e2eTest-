import {Request,Response,Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createBlogValidation, errorFormatter, errorMessagesInputValidation, updateBlogValidation} from "../Models/InputValidation";
import {
    dbBlogs,
    BlogsType,
    findBlogOnId,
    updateBlogOnId,
    getAllBlog,
    createBlog
} from "../RepositoryInDB/blog-repositoryDB";
import {randomUUID} from "crypto";
import {blogsCollection, client} from "../db";

export const blogsRouter=Router({});

//const errors= [];
blogsRouter.get('/',async (req:Request,res:Response)=>{
    const resultAllBlogs=await getAllBlog;
    return res.status(200).send(resultAllBlogs())
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

    const nameNewBlog=req.body.name;
    const descriptionNewBlog=req.body.description;
    const websiteUrlNewBlog=req.body.websiteUrl;
    const resultCreatBlog=await createBlog(nameNewBlog,descriptionNewBlog,websiteUrlNewBlog)

        await blogsCollection.insertOne(resultCreatBlog);
        return res.status(201).send({id:resultCreatBlog.id,name:resultCreatBlog.name,description:resultCreatBlog.description,
            websiteUrl:resultCreatBlog.websiteUrl,createdAt:resultCreatBlog.createdAt})

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

        return res.sendStatus(204);

    })

blogsRouter.delete('/:id',basicAuthMiddleware,
   async (req: Request, res: Response) => {

    const findDeleteBlog = await findBlogOnId(req.params.id);
    if (!findDeleteBlog) {
        return res.sendStatus(404);
    }
       await blogsCollection.deleteOne({id:findDeleteBlog.id})
    return res.sendStatus(204);
})