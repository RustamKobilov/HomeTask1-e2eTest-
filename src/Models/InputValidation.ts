import {body, cookie, param, query, ValidationError, validationResult} from "express-validator";
import {NextFunction} from "express";
import {Request, Response} from "express";
import {throws} from "assert";
import {authService} from "../domain/authService";
import {BlogModel, RecoveryPasswordModel} from "./shemaAndModel";

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


export const createBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]
export const updateBlogValidation = [checkBlogName, checkBlogDescription, checkBlogWebsiteUrl]

const checkPostTitle = body('title').isString().trim().notEmpty().isLength({min: 1, max: 30})
const checkPostShortDescription = body('shortDescription').isString().trim().notEmpty().isLength({min: 1, max: 100})
const checkPostContent = body('content').isString().trim().notEmpty().isLength({min: 1, max: 1000})
const checkPostBlogId = body('blogId').isString().trim().notEmpty().isLength({min: 1}).custom(async value => {
    const blog = await BlogModel.findOne({id: value}, {projection: {_id: 0}})
    if (!blog) {
        throw new Error('blog not found')
    }
    return true;
})
const checkUserLogin =body('login').isString().trim().notEmpty().isLength({min:3,max:10}).matches(/^[a-zA-Z0-9_-]*$/).custom(async value => {
    const login = await authService.checkLogin(value)
    if (!login) {
        return true;
    }
    throw new Error('login busy')
})
const checkUserPassword=body('password').isString().trim().notEmpty().isLength({min:6,max:20})
const checkUserEmail=body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async value => {
    const email = await authService.checkEmail(value)
    if (!email) {
        return true;
    }
    throw new Error('email busy')
})

const checkUserEmailAndConformation=body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom(async (value,{req}) => {
    const user = await authService.checkEmail(value)
    if (!user) {
        throw new Error('email busy')
    }
    if(user.userConfirmationInfo.userConformation==true){
        throw new Error('email confirmed')
    }
    req.user=user
    return true
})

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

const checkInputContent=body('content').exists().isString().notEmpty().isLength({min:20,max:300})

const checkInputCode=body('code').exists().isString().notEmpty().custom(async value=>{
    const resultConfirmCOde=await authService.checkConfirmationCode(value)
    if(!resultConfirmCOde){
        throw new Error('code invalid')
    }
    return true
})

const checkUserEmailPasswordRecovery=body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

const checkPasswordRecovery=body('newPassword').isString().trim().notEmpty().isLength({min:6,max:20})

const checkInputRecoveryCodeAndPasswordReplay=body("recoveryCode").isString().trim().notEmpty()
    .custom(async (value,{req})=>{
    const resultRecoveryCode=await authService.checkRecoveryCode(value)
    if(!resultRecoveryCode){
        throw new Error('RecoveryCode invalid')
    }
    return true
})

export const createPostValidation = [checkPostTitle, checkPostShortDescription, checkPostContent, checkPostBlogId]
export const updatePostValidation = [...createPostValidation]
export const getPostForBlogsValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const postPostForBlogsValidation=[checkPageNumber, checkPageSize, checkSortBy, checkSortDirection, checkPostTitle, checkPostShortDescription, checkPostContent]
export const getBlogsValidation = [checkSearchNameTerm, checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const getPostValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]
export const getUsersValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection,checkSearchLoginTerm,checkSearchEmailTerm]
export const postUsersValidation=[checkUserLogin,checkUserPassword,checkUserEmail,errorMessagesInputValidation]
export const loginUserValidation=[checkInputLogin,checkInputPassword, errorMessagesInputValidation]

export const postCommentForPostValidation=[checkInputContent,errorMessagesInputValidation]
export const getCommentsForPostValidation = [checkPageNumber, checkPageSize, checkSortBy, checkSortDirection]

export const postRegistrationEmailResending=[checkUserEmailAndConformation,errorMessagesInputValidation]
export const postRegistrConfirm=[checkInputCode,errorMessagesInputValidation]
export const postRecoveryPassword=[checkUserEmailPasswordRecovery,errorMessagesInputValidation]
export const postNewPassword=[checkPasswordRecovery,checkInputRecoveryCodeAndPasswordReplay,errorMessagesInputValidation]

//   const recoveryCode=body("recoveryCode").isString().custom(async valueCode=>{
//             const resultRecoveryCode=await authService.checkRecoveryCode(valueCode)
//             if(!resultRecoveryCode){
//                 throw new Error('RecoveryCode no in base')
//             }
//             const resultPasswortReplay=await authService.checkPasswordReplay(valuePassword,resultRecoveryCode.userId)
//             if(!resultPasswortReplay){
//
//             }
//             })