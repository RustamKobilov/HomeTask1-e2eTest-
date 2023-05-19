import {Router,Request,Response} from "express";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {getUsersValidation, postUsersValidation} from "../Models/InputValidation";
import {usersController} from "../composition-root";


export const usersRouter=Router({})


usersRouter.get('/',basicAuthMiddleware, getUsersValidation, usersController.getUsers.bind(usersController))

usersRouter.post('/',basicAuthMiddleware,postUsersValidation, usersController.createUser.bind(usersController))

usersRouter.delete('/:id',basicAuthMiddleware, usersController.deleteUser.bind(usersController))
