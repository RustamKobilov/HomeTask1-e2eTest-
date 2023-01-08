import {body, ValidationError, validationResult} from "express-validator";
import {errorView} from "./ErrorModel";


const checkBlogName = body('name').isString().trim().notEmpty().isLength({min:1,max:15})
const checkBlogDescription = body('description').isString().trim().notEmpty().isLength({min:1,max:500})
const checkBlogWebsiteUrl = body('websiteUrl').isString().trim().notEmpty().isLength({min:1,max:100}).
matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);


//('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
export const createBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]
export const updateBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]

const checkPostTitle=body('title').isString().isLength({min:1,max:30})
const checkPostShortDescription=body('shortDescription').isString().trim().notEmpty().isLength({min:1,max:100})
const checkPostContent=body('content').isString().trim().notEmpty().isLength({min:1,max:1000})
const checkPostBlogid=body('blogId').isString().trim().notEmpty().isLength({min:1})
//.matches(/[0-9]/)
export const createPostValidation =[checkPostTitle,checkPostShortDescription,checkPostContent,checkPostBlogid]
export const updatePostValidation=[...createPostValidation]

export const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
    return errorView(param);
};

