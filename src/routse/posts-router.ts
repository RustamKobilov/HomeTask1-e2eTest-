import {Request,Response,Router} from "express";

import {errorView} from "../Models/ErrorModel";
import {body, ValidationError, validationResult} from "express-validator";
import {dbPosts, findPostOnId, postInputModel} from "../Repository/posts-repositiry";
import {findBlogOnId} from "../Repository/blog-repository";
import {blogsRouter} from "./blogs-router";


export const postsRouter=Router({});

postsRouter.get('/',(req:Request,res:Response)=>{
    return res.sendStatus(200).send(dbPosts)
})

postsRouter.get('/id',(req:Request,res:Response)=> {
    const findPost = findPostOnId(+req.params.id);
    if(findPost){
        return res.sendStatus(200).send(findPost)
    }
    return res.sendStatus(404)
})

postsRouter.post('/',body('title').isString().isLength({min:1,max:30}),
body('shortDescription').isString().isLength({min:1,max:100}),
body('content').isString().isLength({min:1,max:1000}),
body('blogId').isString(),
(req:Request,res:Response)=>{

    const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
        return errorView(param);
    };
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {

        return res.sendStatus(400).json({ errors: errors.array() });
    }

    const titleNewPost=req.body.title;
    const shortDescription=req.body.shortDescription;
    const content=req.body.content;
    const blogId=req.body.blogId;

    const newPost=postInputModel(titleNewPost,shortDescription,content,blogId);
    dbPosts.push(newPost)
    return res.sendStatus(201).send(newPost)

})

postsRouter.put('/:id',body('title').isString().isLength({min:1,max:30}),
    body('shortDescription').isString().isLength({min:1,max:100}),
    body('content').isString().isLength({min:1,max:1000}),
    body('blogId').isString(),
    (req:Request,res:Response)=>{

        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
            return errorView(param);
        };
        const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() });
        }

        const titleUpdatePost=req.body.title;
        const shortDescriptionUpdatePost=req.body.shortDescription;
        const contentUpdatePost=req.body.content;
        const blogIdUpdatePost=req.body.blogId;

        const findUpdatePost=findPostOnId(+req.params.id);
        if(!findUpdatePost){
            return res.sendStatus(404);
        }

        findUpdatePost.title=titleUpdatePost;
        findUpdatePost.shortDescription=shortDescriptionUpdatePost;
        findUpdatePost.content=contentUpdatePost;
        findUpdatePost.blogId=blogIdUpdatePost;

        return res.sendStatus(200)

    })

postsRouter.delete('/:id',(req: Request, res: Response)=> {
    const findDeletePost = findPostOnId(+req.params.id);
    if(findDeletePost){
        return res.sendStatus(404);
    }
    dbPosts.splice(dbPosts.indexOf(findDeletePost), 1)
    return res.sendStatus(204);
})