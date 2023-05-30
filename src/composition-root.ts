import {UserRepository} from "./RepositoryInDB/user-repositoryDB";
import {UserService} from "./Service/userService";
import {JwtService} from "./application/jwtService";
import {BlogRepository} from "./RepositoryInDB/blog-repositoryDB";
import {BlogService} from "./Service/blogService";
import {PostService} from "./Service/postService";
import {PostRepository} from "./RepositoryInDB/post-repositoryDB";
import {CommentRepository} from "./RepositoryInDB/comment-repositoryDB";
import {CommentService} from "./Service/commentsService";
import {DeviceService} from "./Service/deviceService";
import {DeviceRepository} from "./RepositoryInDB/device-repositoryDB";
import {UserController} from "./Controllers/userController";
import {AuthController} from "./Controllers/auth-controller";
import {BlogController} from "./Controllers/blog-controller";
import {PostController} from "./Controllers/post-controller";
import {CommentController} from "./Controllers/comment-controller";
import {DeviceController} from "./Controllers/device-controller";
import { Container } from "inversify";

// const usersRepository = new UserRepository()
// const usersService = new UserService(usersRepository)
// export const usersController = new UserController(usersService)
export const UserContainer = new Container()
UserContainer.bind(UserController).to(UserController)
UserContainer.bind(UserService).to(UserService)
UserContainer.bind(UserRepository).to(UserRepository)

export const AuthContainer = new Container()
AuthContainer.bind(AuthController).to(AuthController)



// const blogsRepository = new BlogRepository()
// const blogsService = new BlogService(blogsRepository)

// const postsRepository = new PostRepository()
// const postsService = new PostService(postsRepository)
export const PostContainer = new Container()
PostContainer.bind(PostController).to(PostController)
PostContainer.bind(PostService).to(PostService)
PostContainer.bind(PostRepository).to(PostRepository)
// export const blogsController = new BlogController(blogsService,postsService)

export const BlogContainer = new Container()
BlogContainer.bind(BlogController).to(BlogController)



// const commentsRepository = new CommentRepository()
// const commentsService = new CommentService(commentsRepository)
// export const postsController = new PostController(postsService, commentsService)

export const CommentContainer = new Container()
CommentContainer.bind(CommentController).to(CommentController)
CommentContainer.bind(CommentService).to(CommentService)
CommentContainer.bind(CommentRepository).to(CommentRepository)


// export const commentsController = new CommentController(commentsService)


// const devicesRepository = new DeviceRepository()
// const devicesService = new DeviceService(devicesRepository, jwtServices)
// export const devicesController = new DeviceController(devicesService,jwtServices)

export const DeviceContainer = new Container()
DeviceContainer.bind(DeviceController).to(DeviceController)
DeviceContainer.bind(DeviceService).to(DeviceService)
DeviceContainer.bind(DeviceRepository).to(DeviceRepository)