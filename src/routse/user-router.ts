import {Request,Response,Router} from "express";

export const usersRouter=Router({})

import {blogsCollection, usersCollection} from "../db";

import {
    createUser, findUserById,
    getAllUsers,
    PaginationTypeAddNewUser,
    PaginationTypeInputUser
} from "../RepositoryInDB/user-repositoryDB";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {body} from "express-validator";
import {getUsersValidation, postUsersValidation} from "../Models/InputValidation";
import {findBlogOnId} from "../RepositoryInDB/blog-repositoryDB";
import {setDate} from "date-fns";

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

usersRouter.get('/',basicAuthMiddleware, getUsersValidation,async (req:Request,res:Response)=>{
    const paginationResult = getPaginationValuesUser(req.query)
    const resultAllUsers= await getAllUsers(paginationResult)

    return res.status(200).send(resultAllUsers)
})

usersRouter.post('/',basicAuthMiddleware,postUsersValidation,async (req:Request,res:Response)=>{
    const paginationResult =getPaginationValuesAddNewUser(req.body)
    const resultNewUsers= await createUser(paginationResult)
    resultNewUsers.userConfirmationInfo.userConformation=true
    await usersCollection.insertOne(resultNewUsers)
    return res.status(201).send({id:resultNewUsers.id,login:resultNewUsers.login,email:resultNewUsers.email,createdAt:resultNewUsers.createdAt})
})

usersRouter.delete('/:id',basicAuthMiddleware,async (req:Request,res:Response)=>{
    const findDeleteUser = await findUserById(req.params.id);
    if (!findDeleteUser) {
        return res.sendStatus(404);
    }
    await usersCollection.deleteOne({id: findDeleteUser.id})
    return res.sendStatus(204);
})
