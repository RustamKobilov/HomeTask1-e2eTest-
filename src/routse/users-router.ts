import {Router} from "express";
import {Containers} from "../composition-root";
import {UserController} from "../Controllers/userController";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {getUsersValidation, postUsersValidation} from "../Models/InputValidation";


const usersController = Containers.resolve(UserController)

export const usersRouter=Router({})


usersRouter.get('/',basicAuthMiddleware, getUsersValidation, usersController.getUsers.bind(usersController))

usersRouter.post('/',basicAuthMiddleware,postUsersValidation, usersController.createUser.bind(usersController))

usersRouter.delete('/:id',basicAuthMiddleware, usersController.deleteUser.bind(usersController))
