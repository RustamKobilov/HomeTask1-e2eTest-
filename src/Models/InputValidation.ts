import {body, param, query, ValidationError, validationResult} from "express-validator";
import {errorView} from "./ErrorModel";
import {NextFunction} from "express";
import {Request, Response} from "express";
import {throws} from "assert";
import {blogsCollection} from "../db";

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


const checkBlogName = body('name').isString().trim().notEmpty().isLength({min: 1, max: 15})
const checkBlogDescription = body('description').isString().trim().notEmpty().isLength({min: 1, max: 500})
const checkBlogWebsiteUrl = body('websiteUrl').isString().trim().notEmpty().isLength({
    min: 1,
    max: 100
}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);


//('[a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
export const createBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]
export const updateBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]

const checkPostTitle = body('title').isString().trim().notEmpty().isLength({min: 1, max: 30})
const checkPostShortDescription = body('shortDescription').isString().trim().notEmpty().isLength({min: 1, max: 100})
const checkPostContent = body('content').isString().trim().notEmpty().isLength({min: 1, max: 1000})
const checkPostBlogId = body('blogId').isString().trim().notEmpty().isLength({min: 1}).custom(async value => {
    const blog = await blogsCollection.findOne({id: value}, {projection: {_id: 0}})
    if (!blog) {
        throw new Error('blog not found')
    }
    return true;
})
const checkUserLogin =body('login').isString().trim().notEmpty().isLength({min:3,max:10})
const checkUserPassword=body('password').isString().trim().notEmpty().isLength({min:6,max:20})
const checkUserEmail=body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

//validation default

const checkPageNumber = query('pageNumber').default(1).isInt({min: 1})
const checkPageSize = query('pageSize').default(10).isInt({min: 1})
const checkSortBy = query('sortBy').default('createdAt').isString()
const checkSortDirection = query('sortDirection').default('desc').isString()
const checkSearchNameTerm = query('searchNameTerm').default(null).isString()
const checkSearchLoginTerm =query('searchLoginTerm').default(null).isString()
const checkSearchEmailTerm = query('searchEmailTerm').default(null).isString()

const checkInputLogin=body('loginOrEmail').exists().isString().trim().notEmpty()
const checkInputPassword=body('password').exists().isString().trim().notEmpty()

export const createPostValidation = [checkPostTitle, checkPostShortDescription, checkPostContent, checkPostBlogId]
export const updatePostValidation = [...createPostValidation]
export const getPostForBlogsValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const postPostForBlogsValidation=[checkPageNumber, checkPageSize, checkSortBy, checkSortDirection, checkPostTitle, checkPostShortDescription, checkPostContent]
export const getBlogsValidation = [checkSearchNameTerm, checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const getPostValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const getUsersValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection,checkSearchLoginTerm,checkSearchEmailTerm]
export const postUsersValidation=[checkUserLogin,checkUserPassword,checkUserEmail,errorMessagesInputValidation]
export const loginUserValidation=[checkInputLogin,checkInputPassword, errorMessagesInputValidation]

