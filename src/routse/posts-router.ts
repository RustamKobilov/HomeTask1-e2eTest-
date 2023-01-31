import {Request,Response,Router} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createPostValidation, errorMessagesInputValidation, updatePostValidation} from "../Models/InputValidation";
import {randomUUID} from "crypto";
import {
    createPost,
    findBlogName,
    findPostOnId,
    getAllPosts,
    PostType,
    updatePostOnId
} from "../RepositoryInDB/posts-repositiryDB";
import {postsCollection} from "../db";
export const postsRouter=Router({});

postsRouter.get('/',async(req:Request,res:Response)=>{
    const resultAllPosts=getAllPosts();
    return res.status(200).send(resultAllPosts)
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
    const titleNewPost = req.body.title;
    const shortDescriptionNewPost = req.body.shortDescription;
    const contentNewPost = req.body.content;
    const blogIdForPost = req.body.blogId;

    const blogNameForPost = await findBlogName(blogIdForPost);
    console.log(blogNameForPost)
    if(!blogNameForPost){
        return res.sendStatus(404);
    }
    const resultCreatePost=await createPost(titleNewPost,shortDescriptionNewPost,
        contentNewPost,blogIdForPost,blogNameForPost.name)

       await postsCollection.insertOne(resultCreatePost);
        return res.status(201).send({id:resultCreatePost.id,title:resultCreatePost.title,
            shortDescription:resultCreatePost.shortDescription, content:resultCreatePost.content,
            blogId:resultCreatePost.blogId,blogName:resultCreatePost.blogName,createdAt:resultCreatePost.createdAt})
})

postsRouter.put('/:id',basicAuthMiddleware,updatePostValidation,errorMessagesInputValidation,
    async (req:Request,res:Response)=>{
        const idUpdatePost=req.params.id;
        const titleUpdatePost=req.body.title;
        const shortDescriptionUpdatePost=req.body.shortDescription;
        const contentUpdatePost=req.body.content;
        const blogIdUpdatePost=req.body.blogId;

        const findUpdatePost=await updatePostOnId(idUpdatePost,titleUpdatePost,shortDescriptionUpdatePost,
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
    await postsCollection.deleteOne({id:findDeletePost.id})
    return res.sendStatus(204);
})