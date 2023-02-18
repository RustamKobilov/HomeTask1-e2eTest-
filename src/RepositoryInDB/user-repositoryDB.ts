import bcrypt from 'bcrypt'
import {randomUUID} from "crypto";
import {blogsCollection, usersCollection} from "../db";
import {helper} from "./helper";
import {inputSortDataBaseType, PostType} from "./posts-repositiryDB";

export type UserType = {
    id: string
    login: string
    password: string
    email: string
    createdAt: string
    salt: string
    hash: string
}

export type outputUserType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type PaginationTypeInputUser = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1|-1
    searchLoginTerm: string
    searchEmailTerm: string
}

export type PaginationTypeAddNewUser = {
    login: string
    password: string
    email: string
}

export async function getAllUsers(paginationUser: PaginationTypeInputUser): Promise<inputSortDataBaseType<UserType>> {

    const searchLoginTerm = {login: {$regex: paginationUser.searchLoginTerm??'', $options: "$i"}}
    const searchEmailTerm = {email: {$regex: paginationUser.searchEmailTerm??'', $options: "$i"}}

    const totalCountUser =
        await usersCollection.countDocuments({$and: [searchLoginTerm, searchEmailTerm]})

    const paginationFromHelperForUsers=helper.getPaginationFunctionSkipSortTotal(paginationUser.pageNumber,
        paginationUser.pageSize,totalCountUser)

    const sortUser = await usersCollection.find({$and: [searchLoginTerm, searchEmailTerm]}).
    sort({[paginationUser.sortBy]: paginationUser.sortDirection}).skip(paginationFromHelperForUsers.skipPage).
    limit(paginationUser.pageSize).project<UserType>({
        _id: 0,
        hash: 0,
        salt: 0,
        password: 0
    }).toArray()

    return {
        pagesCount: paginationFromHelperForUsers.totalCount,
        page: paginationUser.pageNumber,
        pageSize: paginationUser.pageSize,
        totalCount: totalCountUser,
        items: sortUser
    }
}

export async function createUser(paginationAddUser: PaginationTypeAddNewUser): Promise<UserType> {
    const salt = await bcrypt.genSalt(8)
    const hashResult = await hashPassword(paginationAddUser.password, salt)

    return {
        id: randomUUID(),
        login: paginationAddUser.login,
        password: hashResult,
        email: paginationAddUser.email,
        createdAt: new Date().toISOString(),
        salt: salt,
        hash: hashResult
    }
}

async function hashPassword(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function findUserById(id: string): Promise<UserType | null> {
    const resultFindUser = await usersCollection.findOne({id: id}, {projection: {_id: 0}})
    return resultFindUser
}

export const userRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        return usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: 0}})
    },

}


export async function searchDateVerificationUserLoginAndEmail(passwordInput: string, loginInput: string): Promise<boolean> {
    const resultSearch = await usersCollection.findOne({$or: [{login: loginInput}, {email: loginInput}]})
    if (resultSearch == null) {
        return false
    }
    const hashPasswordInput = await hashPassword(passwordInput, resultSearch.salt)
    if (hashPasswordInput != resultSearch.hash) {
        return false
    }
    return true;
}

// const searchLoginTerm = paginationUser.searchLoginTerm != null ? {
//     login: {$regex: paginationUser.searchLoginTerm, $options: "$i"}} : {}
// const searchEmailTerm = paginationUser.searchEmailTerm != null ? {
//     email: {$regex: paginationUser.searchEmailTerm, $options: "$i"}} : {}
//
// const totalCountUser =
//     await usersCollection.countDocuments({$and: [searchLoginTerm, searchEmailTerm]})
