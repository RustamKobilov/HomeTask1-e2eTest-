import {Router} from "express";
import { BlogContainer } from "../composition-root";
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


const blogsController = BlogContainer.resolve(BlogController)

export const blogsRouter = Router({});


blogsRouter.get('/', getBlogsValidation, blogsController.getBlogs.bind(blogsController))

blogsRouter.post('/', basicAuthMiddleware, createBlogValidation, errorMessagesInputValidation, blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id/posts', getPostForBlogsValidation, errorMessagesInputValidation, blogsController.getPostForBlog.bind(blogsController))

blogsRouter.post('/:id/posts', basicAuthMiddleware, postPostForBlogsValidation, errorMessagesInputValidation, blogsController.createPostForBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))

blogsRouter.put('/:id', basicAuthMiddleware, updateBlogValidation, errorMessagesInputValidation, blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', basicAuthMiddleware, blogsController.deleteBlog.bind(blogsController))