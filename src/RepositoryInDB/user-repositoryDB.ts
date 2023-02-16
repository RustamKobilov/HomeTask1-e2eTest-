import bcrypt from 'bcrypt'
import {randomUUID} from "crypto";
import {blogsCollection, usersCollection} from "../db";
import {countPageMath, skipPageMath, valueSortDirection} from "./jointRepository";
import {inputSortDataBaseType, PostType} from "./posts-repositiryDB";

export type UserType ={
    id:string
    login:string
    password:string
    email:string
    createdAt: string
    salt:string
    hash:string
}

export type outputUserType ={
    id:string
    login:string
    email:string
    createdAt: string
}

export type PaginationTypeInputUser={
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
    searchLoginTerm:string
    searchEmailTerm:string
}

export type PaginationTypeAddNewUser={
    login:string
    password:string
    email:string
}

export async function getAllUsers(paginationUser:PaginationTypeInputUser):Promise<inputSortDataBaseType<UserType>>{

     const searchLoginTerm=paginationUser.searchLoginTerm!=null?{name:{$regex:paginationUser.searchLoginTerm,$options: "$i"}}:{}
    const searchEmailTerm=paginationUser.searchEmailTerm!=null?{description:{$regex:paginationUser.searchEmailTerm,$options: "$i"}}:{}

    const totalCountUser=
         await usersCollection.countDocuments({$and:[searchLoginTerm, searchEmailTerm]})

    const skipPage = skipPageMath(paginationUser.pageNumber, paginationUser.pageSize);
    const countPage = countPageMath(totalCountUser, paginationUser.pageSize)

    const sortUser= await usersCollection.find({$and:[searchLoginTerm, searchEmailTerm]}).sort({[paginationUser.sortBy]:valueSortDirection(paginationUser.sortDirection)}).
        skip(skipPage).limit(paginationUser.pageSize).project<UserType>({_id: 0,hash:0,salt:0}).toArray()

    return {
        pagesCount: countPage,
        page: paginationUser.pageNumber,
        pageSize: paginationUser.pageSize,
        totalCount: totalCountUser,
        items: sortUser
    }
}

export async function createUser(paginationAddUser:PaginationTypeAddNewUser):Promise<UserType>{
    const salt= await bcrypt.genSalt(8)
    const hashResult=await hashPassword(paginationAddUser.password,salt)

    return {id: randomUUID(),login:paginationAddUser.login,password:hashResult,email:paginationAddUser.email,createdAt:new Date().toISOString(),
        salt:salt,hash:hashResult}
}
async function hashPassword(password:string,salt:string){
    const hash= await bcrypt.hash(password,salt)
    return hash
}

async function searchDateVerificationUser(passwordInput:string,loginInput:string) {
    const resultSearch = await usersCollection.findOne({$or: [{login: loginInput}, {hashPassword: 1}]})
    if (resultSearch == null) {
        return false
    }
    const hashPasswordInput = await hashPassword(passwordInput, resultSearch.salt)
    if (hashPasswordInput != resultSearch.hash) {
        return false
    }

    return true
}
