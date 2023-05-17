import {UserRepository} from "./RepositoryInDB/user-repositoryDB";
import {UserService} from "./Service/userService";
import {UserController} from "./routse/user-router";

const usersRepository = new UserRepository()
const usersService = new UserService(usersRepository)
export const usersController = new UserController(usersService)