import {Request,Response,Router} from "express";
import {
    PaginationTypeAddNewUser,
    PaginationTypeInputUser,
} from "../RepositoryInDB/user-repositoryDB";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {getUsersValidation, postUsersValidation} from "../Models/InputValidation";
import {UserService} from "../Service/userService";
import {usersController} from "../composition-root";


export const usersRouter=Router({})

const getPaginationValuesUser = (query:any): PaginationTypeInputUser=>{
   return {
       pageNumber: +query.pageNumber,
       pageSize: +query.pageSize,
       sortBy: query.sortBy,
       sortDirection: query.sortDirection === 'desc' ? -1 : 1,
       searchLoginTerm:query.searchLoginTerm,
       searchEmailTerm: query.searchEmailTerm
   }
}

export const getPaginationValuesAddNewUser = (body:any):PaginationTypeAddNewUser=>{
    return{
        login:body.login,
            password:body.password,
            email:body.email
}
}

export class UserController{

    constructor(protected userService : UserService) {}
    async getUsers(req: Request, res: Response) {
        const paginationResult = getPaginationValuesUser(req.query)
        const resultAllUsers = await this.userService.getAllUsers(paginationResult)

        return res.status(200).send(resultAllUsers)
    }

    async createUser(req: Request, res: Response) {
        const paginationResult = getPaginationValuesAddNewUser(req.body)
        const resultNewUsers = await this.userService.createUserByAdmin(paginationResult)

        return res.status(201).send({
            id: resultNewUsers.id,
            login: resultNewUsers.login,
            email: resultNewUsers.email,
            createdAt: resultNewUsers.createdAt
        })
    }

    async deleteUser(req: Request, res: Response) {
        const deleteUser = await this.userService.deleteUserById(req.params.id);
        if (!deleteUser) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);
    }
}

usersRouter.get('/',basicAuthMiddleware, getUsersValidation,usersController.getUsers.bind(usersController))

usersRouter.post('/',basicAuthMiddleware,postUsersValidation, usersController.createUser.bind(usersController))

usersRouter.delete('/:id',basicAuthMiddleware, usersController.deleteUser.bind(usersController))
