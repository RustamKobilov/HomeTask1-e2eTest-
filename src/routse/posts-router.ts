import {Request,Response,Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createPostValidation, errorFormatter, errorMessagesInputValidation, updatePostValidation} from "../Models/InputValidation";
import {randomUUID} from "crypto";
import {BlogsType, findBlogOnId} from "../RepositoryInDB/blog-repositoryDB";
import {findBlogName, findPostOnId, PostType, updatePostOnId} from "../RepositoryInDB/posts-repositiryDB";
import {client} from "../db";
export const postsRouter=Router({});

postsRouter.get('/',async(req:Request,res:Response)=>{
    const result=await client.db('hometask3').collection('Posts').find({}).toArray();
    return res.status(200).send(result)
})

postsRouter.get('/:id',async (req:Request,res:Response)=> {
    const findPost = await findPostOnId(req.params.id);
    if(findPost){
        return res.status(200).send(findPost)
    }
    return res.sendStatus(404)
})

postsRouter.post('/',basicAuthMiddleware,createPostValidation,errorMessagesInputValidation,
async (req: Request, res: Response) => {
    const idNewPost = randomUUID();
    const titleNewPost = req.body.title;
    const shortDescriptionNewPost = req.body.shortDescription;
    const contentNewPost = req.body.content;
    const blogIdForPost = req.body.blogId;
    const blogNameForPost = await findBlogName(blogIdForPost);
    if(!blogNameForPost){
        return res.sendStatus(404);
    }
        const newPost: PostType = {
            id: idNewPost,
            title: titleNewPost,
            shortDescription: shortDescriptionNewPost,
            content: contentNewPost,
            blogId: blogIdForPost,
            blogName: blogNameForPost.name,
            createdAt: new Date().toISOString()
        };

        await client.db('hometask3').collection('Posts').insertOne(newPost)
        return res.status(201).send(newPost)
})

postsRouter.put('/:id',basicAuthMiddleware,updatePostValidation,errorMessagesInputValidation,
    (req:Request,res:Response)=>{
        const idUpdatePost=req.params.id;
        const titleUpdatePost=req.body.title;
        const shortDescriptionUpdatePost=req.body.shortDescription;
        const contentUpdatePost=req.body.content;
        const blogIdUpdatePost=req.body.blogId;

        const findUpdatePost=updatePostOnId(idUpdatePost,titleUpdatePost,shortDescriptionUpdatePost,
            contentUpdatePost,blogIdUpdatePost);
        if(!findUpdatePost){
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    })

postsRouter.delete('/:id',basicAuthMiddleware,async (req: Request, res: Response) => {
    const findDeletePost = await findPostOnId(req.params.id);
    if (!findDeletePost) {

        return res.sendStatus(404);
    }
    await client.db('hometask3').collection('Posts').deleteOne({id:findDeletePost.id})
    return res.sendStatus(204);
})