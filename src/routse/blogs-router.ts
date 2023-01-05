import {Request,Response,Router} from "express";
import {blogInputModel, dbBlogs} from "../blog-repository";
import {findBlogOnId} from "../blog-repository";
import {errorView} from "../Models/ErrorModel";
import {body, ValidationError, validationResult} from "express-validator";


import {app} from "../app";
import any = jasmine.any;

export const blogsRouter=Router({});

//const middlewareAutorized=require('./auth');

blogsRouter.get('/',(req:Request,res:Response)=>{
    return res.status(200).send(dbBlogs)
})

blogsRouter.get('/id',(req:Request,res:Response)=> {
    const findBlog = findBlogOnId(+req.params.id);
    if(findBlog){
       return res.status(200).send(findBlog)
    }
    return res.status(404)
})
//,middlewareAutorized()
//.
//     matches('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
blogsRouter.post('/',body('name').isString().isLength({min:1,max:15}),
    body('description').isString().isLength({min:1,max:500}),
    body('websiteUrl').isString().isLength({min:1,max:100}),
    (req:Request,res:Response)=>{
        const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
            return errorView(param);
        };
    const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {

            return res.status(404).json({ errors: errors.array() });
        }

    const nameNewBlog=req.body.name;
    const descriptionNewBlog=req.body.description;
    const websiteUrlNewBlog=req.body.websiteUrl;

    const newBlog=blogInputModel(nameNewBlog,descriptionNewBlog,websiteUrlNewBlog)
    dbBlogs.push(newBlog)
        return res.status(201).send(newBlog)

    })