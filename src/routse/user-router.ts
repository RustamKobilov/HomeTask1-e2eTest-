import {Request,Response,Router} from "express";

export const usersRouter=Router({})

import {usersCollection} from "../db";

import {
    createUser,
    getAllUsers,
    PaginationTypeAddNewUser,
    PaginationTypeInputUser
} from "../RepositoryInDB/user-repositoryDB";
import {basicAuthMiddleware} from "../Middleware/autorized";
import {body} from "express-validator";
import {getUsersValidation, postUsersValidation} from "../Models/InputValidation";

const getPaginationValuesUser = (query:any): PaginationTypeInputUser=>{
   return {
       pageNumber: +query.pageNumber,
       pageSize: +query.pageSize,
       sortBy: query.sortBy,
       sortDirection: query.sortDirection,
       searchLoginTerm:query.searchLoginTerm,
       searchEmailTerm: query.searchEmailTerm
   }
}

const getPaginationValuesAddNewUser = (body:any):PaginationTypeAddNewUser=>{
    return{
        login:body.login,
            password:body.password,
            email:body.email

}
}

usersRouter.get('/',basicAuthMiddleware,getUsersValidation,async (req:Request,res:Response)=>{
    const paginationResult =getPaginationValuesUser(req.query)
    const resultAllUsers= await getAllUsers(paginationResult)
    return res.status(200).send(resultAllUsers)
})

usersRouter.post('/',basicAuthMiddleware,postUsersValidation,async (req:Request,res:Response)=>{
    const paginationResult =getPaginationValuesAddNewUser(req.body)
    const resultNewUsers= await createUser(paginationResult)
    await usersCollection.insertOne(resultNewUsers)
    return res.status(201).send({id:resultNewUsers.id,login:resultNewUsers.login,email:resultNewUsers.email,createdAt:resultNewUsers.createdAt})
})