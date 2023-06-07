import {Router} from "express";
import { Containers } from "../composition-root";
import { BlogController } from "../Controllers/blog-controller";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {
    createBlogValidation,
    errorMessagesInputValidation,
    getBlogsValidation,
    getPostForBlogsValidation,
    postPostForBlogsValidation,
    updateBlogValidation
} from "../Models/InputValidation";
import {authUserIdentificationBearer} from "../Middleware/authUserIdentificationBearer";


const blogsController = Containers.resolve(BlogController)

export const blogsRouter = Router({});


blogsRouter.get('/', getBlogsValidation, blogsController.getBlogs.bind(blogsController))

blogsRouter.post('/', basicAuthMiddleware, createBlogValidation, errorMessagesInputValidation, blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id/posts', getPostForBlogsValidation, authUserIdentificationBearer, errorMessagesInputValidation, blogsController.getPostForBlog.bind(blogsController))

blogsRouter.post('/:id/posts', basicAuthMiddleware, postPostForBlogsValidation, errorMessagesInputValidation, blogsController.createPostForBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))

blogsRouter.put('/:id', basicAuthMiddleware, updateBlogValidation, errorMessagesInputValidation, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', basicAuthMiddleware, blogsController.deleteBlog.bind(blogsController))