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