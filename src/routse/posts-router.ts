import {Request,Response,Router} from "express";

import {errorView} from "../Models/ErrorModel";
import {body, ValidationError, validationResult} from "express-validator";
import {dbPosts, findPostOnId, postInputModel} from "../Repository/posts-repositiry";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createPostValidation, errorFormatter, updatePostValidation} from "../Models/InputValidation";

export const postsRouter=Router({});

postsRouter.get('/',(req:Request,res:Response)=>{
    return res.status(200).send(dbPosts)
})

postsRouter.get('/:id',(req:Request,res:Response)=> {
    const findPost = findPostOnId(+req.params.id);
    if(findPost){
        return res.status(200).send(findPost)
    }
    return res.sendStatus(404)
})

postsRouter.post('/',basicAuthMiddleware,createPostValidation,
(req:Request,res:Response)=>{

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {

        const error = (errors.array()).filter((eror, index, self) =>
                index === self.findIndex((checkeror) => (
                checkeror.message === eror.message && checkeror.field === eror.field
                ))
        )

        return res.status(400).json({errorsMessages: error} );
    }

    const titleNewPost=req.body.title;
    const shortDescription=req.body.shortDescription;
    const content=req.body.content;
    const blogId=req.body.blogId;

    const newPost=postInputModel(titleNewPost,shortDescription,content,blogId);
    dbPosts.push(newPost)
    return res.status(201).send(newPost)

})

postsRouter.put('/:id',basicAuthMiddleware,updatePostValidation,
    (req:Request,res:Response)=>{

        const errors = validationResult(req).formatWith(errorFormatter)
        if (!errors.isEmpty()) {

            const error = (errors.array()).filter((eror, index, self) =>
                    index === self.findIndex((checkeror) => (
                        checkeror.message === eror.message && checkeror.field === eror.field
                    ))
            )

            return res.status(400).json({errorsMessages: error} );
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

        return res.sendStatus(200);

    })

postsRouter.delete('/:id',basicAuthMiddleware,(req: Request, res: Response)=> {
    const findDeletePost = findPostOnId(+req.params.id);
    if(!findDeletePost){
        return res.sendStatus(404);
    }
    dbPosts.splice(dbPosts.indexOf(findDeletePost), 1)
    return res.sendStatus(204);
})