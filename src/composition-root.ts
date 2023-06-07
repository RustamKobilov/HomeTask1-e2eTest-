import "reflect-metadata"
import {Container} from "inversify";
import {UserController} from "./Controllers/userController";
import {UserService} from "./Service/userService";
import {UserRepository} from "./RepositoryInDB/user-repositoryDB";
import {AuthController} from "./Controllers/auth-controller";
import {PostController} from "./Controllers/post-controller";
import {PostService} from "./Service/postService";
import {PostRepository} from "./RepositoryInDB/post-repositoryDB";
import {BlogController} from "./Controllers/blog-controller";
import {BlogService} from "./Service/blogService";
import {BlogRepository} from "./RepositoryInDB/blog-repositoryDB";
import {CommentController} from "./Controllers/comment-controller";
import {CommentService} from "./Service/commentsService";
import {CommentRepository} from "./RepositoryInDB/comment-repositoryDB";
import {DeviceController} from "./Controllers/device-controller";
import {DeviceService} from "./Service/deviceService";
import {DeviceRepository} from "./RepositoryInDB/device-repositoryDB";
import {JwtService} from "./application/jwtService";


// const usersRepository = new UserRepository()
// const usersService = new UserService(usersRepository)
// export const usersController = new UserController(usersService)


// const blogsRepository = new BlogRepository()
// const blogsService = new BlogService(blogsRepository)

// const postsRepository = new PostRepository()
// const postsService = new PostService(postsRepository)


// export const blogsController = new BlogController(blogsService,postsService)




// const commentsRepository = new CommentRepository()
// const commentsService = new CommentService(commentsRepository)
// export const postsController = new PostController(postsService, commentsService)



// export const commentsController = new CommentController(commentsService)


// const devicesRepository = new DeviceRepository()
// const devicesService = new DeviceService(devicesRepository, jwtServices)
// export const devicesController = new DeviceController(devicesService,jwtServices)



export const Containers = new Container()
Containers.bind(UserController).to(UserController)
Containers.bind(UserService).to(UserService)
Containers.bind(UserRepository).to(UserRepository)
Containers.bind(AuthController).to(AuthController)
Containers.bind(CommentController).to(CommentController)
Containers.bind(CommentService).to(CommentService)
Containers.bind(CommentRepository).to(CommentRepository)
Containers.bind(PostController).to(PostController)
Containers.bind(PostService).to(PostService)
Containers.bind(PostRepository).to(PostRepository)
Containers.bind(BlogController).to(BlogController)
Containers.bind(BlogService).to(BlogService)
Containers.bind(BlogRepository).to(BlogRepository)
Containers.bind(DeviceController).to(DeviceController)
Containers.bind(DeviceService).to(DeviceService)
Containers.bind(DeviceRepository).to(DeviceRepository)
Containers.bind(JwtService).to(JwtService)