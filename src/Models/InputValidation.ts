import {body, ValidationError, validationResult} from "express-validator";
import {errorView} from "./ErrorModel";
import {NextFunction} from "express";
import {Request, Response} from "express";
import {dbBlogs} from "../Repository/blog-repository";
import {throws} from "assert";

const checkBlogName = body('name').isString().trim().notEmpty().isLength({min: 1, max: 15})
const checkBlogDescription = body('description').isString().trim().notEmpty().isLength({min: 1, max: 500})
const checkBlogWebsiteUrl = body('websiteUrl').isString().trim().notEmpty().isLength({
    min: 1,
    max: 100
}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);


//('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
export const createBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]
export const updateBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]

const checkPostTitle = body('title').isString().isLength({min: 1, max: 30})
const checkPostShortDescription = body('shortDescription').isString().trim().notEmpty().isLength({min: 1, max: 100})
const checkPostContent = body('content').isString().trim().notEmpty().isLength({min: 1, max: 1000})
const checkPostBlogid = body('blogId').isString().trim().notEmpty().isLength({min: 1}).custom(value=>{
    const blog=dbBlogs.find(blog=>blog.id===value)
    if(!blog){
        throw new Error('blog not found')
    }
    return true;
})
//.matches(/[0-9]/)
export const createPostValidation = [checkPostTitle, checkPostShortDescription, checkPostContent, checkPostBlogid]
export const updatePostValidation = [...createPostValidation]

export const errorFormatter = ({location, msg, param, value, nestedErrors}: ValidationError) => {
    return errorView(param);
};

export const errorMessagesInputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const resultErrors = errors.array({onlyFirstError: true});
    if (resultErrors.length > 0) {
        return res.status(400).send({
            errorsMessages: resultErrors.map((error) => {
                return {message: error.msg, field: error.param}
            })
        })
    }
    return next();
}
