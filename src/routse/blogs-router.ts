import {Request,Response,Router} from "express";
import {blogInputModel, dbBlogs} from "../Repository/blog-repository";
import {findBlogOnId} from "../Repository/blog-repository";
import {errorView} from "../Models/ErrorModel";
import {body, ValidationError, validationResult} from "express-validator";


import {app} from "../app";
import any = jasmine.any;
import {db, videosRouter} from "./videos-router";

export const blogsRouter=Router({});

//const middlewareAutorized=require('./auth');

blogsRouter.get('/',(req:Request,res:Response)=>{
    return res.sendStatus(200).send(dbBlogs)
})

blogsRouter.get('/id',(req:Request,res:Response)=> {
    const findBlog = findBlogOnId(+req.params.id);
    if(findBlog){
       return res.sendStatus(200).send(findBlog)
    }
    return res.sendStatus(404)
})
//,middlewareAutorized()
//.
//     matches('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
blogsRouter.post('/',body('name').isString().isLength({min:1,max:15}),
    body('description').isString().isLength({min:1,max:500}),
    body('websiteUrl').isString().isLength({min:1,max:100}).matches('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'),
    (req:Request,res:Response)=>{
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
            return errorView(param);
        };
    const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {

            return res.sendStatus(400).json({ errors: errors.array() });
        }

    const nameNewBlog=req.body.name;
    const descriptionNewBlog=req.body.description;
    const websiteUrlNewBlog=req.body.websiteUrl;

    const newBlog=blogInputModel(nameNewBlog,descriptionNewBlog,websiteUrlNewBlog)
    dbBlogs.push(newBlog)
        return res.sendStatus(201).send(newBlog)

    })
blogsRouter.put('/id',body('name').isString().isLength({min:1,max:15}),
    body('description').isString().isLength({min:1,max:500}),
    body('websiteUrl').isString().isLength({min:1,max:100}).matches('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'),
    (req:Request,res:Response)=>{

        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
            return errorView(param);
        };
        const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() });
        }

        const nameUpdateBlog=req.body.name;
        const descriptionUpdateBlog=req.body.description;
        const websiteUrlUpdateBlog=req.body.websiteUrl;

        const findUpdateBlog = findBlogOnId(+req.params.id);
        if(!findUpdateBlog){
            return res.sendStatus(404);
        }

        findUpdateBlog.name =nameUpdateBlog;
        findUpdateBlog.description =descriptionUpdateBlog;
        findUpdateBlog.websiteUrlUpdateBlog =websiteUrlUpdateBlog;

        return res.sendStatus(200);

    })

blogsRouter.delete('/:id', (req: Request, res: Response) => {

    const findDeleteBlog = findBlogOnId(+req.params.id);
    if (!findDeleteBlog) {
        return res.sendStatus(404);
    }
    dbBlogs.splice(dbBlogs.indexOf(findDeleteBlog), 1)
    return res.sendStatus(204);
})