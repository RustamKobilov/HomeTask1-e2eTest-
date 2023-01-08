import {Request,Response,Router} from "express";
import {blogInputModel, dbBlogs} from "../Repository/blog-repository";
import {findBlogOnId} from "../Repository/blog-repository";
import {errorView} from "../Models/ErrorModel";
import {body, ValidationError, validationResult} from "express-validator";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {createBlogValidation, errorFormatter, updateBlogValidation} from "../Models/InputValidation";

export const blogsRouter=Router({});

//const errors= [];
blogsRouter.get('/',(req:Request,res:Response)=>{
    return res.status(200).send(dbBlogs)
})

blogsRouter.get('/:id',(req:Request,res:Response)=> {
    const findBlog = findBlogOnId(req.params.id);
    if(findBlog){
       return res.status(200).send(findBlog)
    }
    return res.sendStatus(404)
})

blogsRouter.post('/', basicAuthMiddleware, createBlogValidation,
    (req:Request,res:Response)=>{

    const errors = validationResult(req).formatWith(errorFormatter);

        if (!errors.isEmpty()) {
            console.log(errors.array())

            const error = (errors.array()).filter((eror, index, self) =>
                    index === self.findIndex((checkeror) => (
                        checkeror.message === eror.message && checkeror.field === eror.field
                    ))
            )

            return res.status(400).json({errorsMessages: error} );
        }


    const nameNewBlog=req.body.name;
    const descriptionNewBlog=req.body.description;
    const websiteUrlNewBlog=req.body.websiteUrl;

    const newBlog=blogInputModel(nameNewBlog,descriptionNewBlog,websiteUrlNewBlog)
    dbBlogs.push(newBlog)
        return res.status(201).send(newBlog)

    })
blogsRouter.put('/:id',basicAuthMiddleware,updateBlogValidation,
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

        const nameUpdateBlog=req.body.name;
        const descriptionUpdateBlog=req.body.description;
        const websiteUrlUpdateBlog=req.body.websiteUrl;

        const findUpdateBlog = findBlogOnId(req.params.id);
        if(!findUpdateBlog){
            return res.sendStatus(404);
        }

        findUpdateBlog.name =nameUpdateBlog;
        findUpdateBlog.description =descriptionUpdateBlog;
        findUpdateBlog.websiteUrl =websiteUrlUpdateBlog;

        return res.sendStatus(204);

    })

blogsRouter.delete('/:id',basicAuthMiddleware,
    (req: Request, res: Response) => {

    const findDeleteBlog = findBlogOnId(req.params.id);
    if (!findDeleteBlog) {
        return res.sendStatus(404);
    }
    dbBlogs.splice(dbBlogs.indexOf(findDeleteBlog), 1)
    return res.sendStatus(204);
})