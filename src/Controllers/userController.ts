import {Request,Response} from "express";
import {UserService} from "../Service/userService";
import { inject, injectable } from "inversify";
import {PaginationTypeInputUser, InputUserNewType} from "../Models/allTypes";

export const getPaginationValuesUser = (query:any): PaginationTypeInputUser=>{
    return {
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection === 'desc' ? -1 : 1,
        searchLoginTerm:query.searchLoginTerm,
        searchEmailTerm: query.searchEmailTerm
    }
}

@injectable()
export class UserController{

    constructor(@inject(UserService) protected userService : UserService) {}
    async getUsers(req: Request, res: Response) {
        const paginationResult = getPaginationValuesUser(req.query)
        const resultAllUsers = await this.userService.getAllUsers(paginationResult)

        return res.status(200).send(resultAllUsers)
    }

    async createUser(req: Request, res: Response) {
        const inputUserAdmin:InputUserNewType ={
            login:req.body.login,
            password:req.body.password,
            email:req.body.email
        }
        const resultNewUsers = await this.userService.createUserByAdmin(inputUserAdmin)

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
