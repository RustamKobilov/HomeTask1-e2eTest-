import {UserRepository} from "./RepositoryInDB/user-repositoryDB";
import {UserService} from "./Service/userService";
import {UserController} from "./routse/users-router";
import {AuthController} from "./routse/auth-router";
import {JwtService} from "./application/jwtService";
import {BlogRepository} from "./RepositoryInDB/blog-repositoryDB";
import {BlogService} from "./Service/blogService";
import {BlogController} from "./routse/blogs-router";
import {PostService} from "./Service/postService";
import {PostRepository} from "./RepositoryInDB/post-repositoryDB";
import {PostController} from "./routse/posts-router";
import {CommentRepository} from "./RepositoryInDB/comment-repositoryDB";
import {CommentService} from "./Service/commentsService";
import {CommentController} from "./routse/comments-router";
import {DeviceController} from "./routse/devices-route";
import {DeviceService} from "./Service/deviceService";
import {DeviceRepository} from "./RepositoryInDB/device-repositoryDB";

const usersRepository = new UserRepository()
const usersService = new UserService(usersRepository)
export const usersController = new UserController(usersService)


const jwtServices = new JwtService()
export const authControllers = new AuthController(usersService,jwtServices)


const blogsRepository = new BlogRepository()
const blogsService = new BlogService(blogsRepository)

const postsRepository = new PostRepository()
const postsService = new PostService(postsRepository)
export const blogsController = new BlogController(blogsService,postsService)


const commentsRepository = new CommentRepository()
const commentsService = new CommentService(commentsRepository)
export const postsController = new PostController(postsService, commentsService)


export const commentsController = new CommentController(commentsService)


const devicesRepository = new DeviceRepository()
const devicesService = new DeviceService(devicesRepository, jwtServices)
export const devicesController = new DeviceController(devicesService,jwtServices)