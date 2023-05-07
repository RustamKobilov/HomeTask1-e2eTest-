import bcrypt from 'bcrypt'
import {randomUUID} from "crypto";
import {helper} from "./helper";
import {inputSortDataBaseType, PostType} from "./posts-repositiryDB";
import {ObjectId} from "mongodb";
import {RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";

export type UserType = {
    id: string
    login: string
    password: string
    email: string
    createdAt: string
    salt: string
    hash: string
    userConfirmationInfo:{
        userConformation:boolean
        code:string,
        expirationCode:string
    }
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

export type RecoveryPassword={
    recoveryCode:string,
    userId:string,
    diesAtDate:string
}


export async function getAllUsers(paginationUser: PaginationTypeInputUser): Promise<inputSortDataBaseType<UserType>> {
    const searchLoginTerm = paginationUser.searchLoginTerm != null ? {
    login: {$regex: paginationUser.searchLoginTerm, $options: "i"}} : {}
const searchEmailTerm = paginationUser.searchEmailTerm != null ? {
    email: {$regex: paginationUser.searchEmailTerm, $options: "i"}} : {}

    const totalCountUser =
        await UserModel.countDocuments({$or: [searchLoginTerm, searchEmailTerm]})


    const paginationFromHelperForUsers=helper.getPaginationFunctionSkipSortTotal(paginationUser.pageNumber,
        paginationUser.pageSize,totalCountUser)

    let sortUser = await UserModel.find({$or: [searchLoginTerm,searchEmailTerm]}
        ,{_id: 0, __v: 0,hash: 0, salt: 0, password: 0, userConfirmationInfo:{_id: 0, __v: 0}}).
    sort({[paginationUser.sortBy]: paginationUser.sortDirection})
        .skip(paginationFromHelperForUsers.skipPage)
        .limit(paginationUser.pageSize).lean()

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

    const date0=new Date()
    const date02=date0.getHours()
    date0.setHours(date02+1)
    const dateExpiration=new Date(date0).toISOString()

    return {
        id: randomUUID(),
        login: paginationAddUser.login,
        password: hashResult,
        email: paginationAddUser.email,
        createdAt: new Date().toISOString(),
        salt: salt,
        hash: hashResult,
        userConfirmationInfo:{
            userConformation:false,
            code:randomUUID(),
            expirationCode:dateExpiration
        }
    }
}

async function hashPassword(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function findUserById(id: string): Promise<UserType | null> {
     const user = await UserModel.findOne({id: id}, {_id: 0, __v: 0})
    return user
}

export const userRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {_id: 0, __v: 0})
    },
    async findUserByCode(code:string):Promise<UserType|null>{
        console.log(code)
        return UserModel.findOne({'userConfirmationInfo.code':code}, {_id: 0, __v: 0})
    },
    async updateUserConformation(id: string):
        Promise<boolean> {
        let user = await UserModel.updateOne({id: id}, {
            $set: {
                'userConfirmationInfo.userConformation': true,

            }
        })

        return user.matchedCount === 1
    },
    async findUserByEmail(email:string):Promise<UserType|null>{

        return UserModel.findOne({email:email}, {_id: 0, __v: 0})
    },
    async findUserByLogin(login:string):Promise<UserType|null>{

        return UserModel.findOne({login:login}, {_id: 0, __v: 0})
    },
    async updateUserConformationCode(id: string,code:string):
        Promise<boolean> {
        let user = await UserModel.updateOne({id: id}, {
            $set: {
                'userConfirmationInfo.code': code,

            }
        })

        return user.matchedCount === 1
    },
    async getRecoveryCode(code:String):Promise<RecoveryPassword|null>{
        return RecoveryPasswordModel.findOne({recoveryCode:code}, {_id: 0, __v: 0})
    },
    async updatePasswordForUserByRecovery(newPassword:string, recoveryCode:string):
    Promise<boolean> {
        let userIdInRecovery= await this.getRecoveryCode(recoveryCode)
        if(!userIdInRecovery){
            return false
        }
        const salt = await bcrypt.genSalt(8)
        const hashResultNewPassword = await hashPassword(newPassword, salt)

        let password = await UserModel.updateOne({id: userIdInRecovery.userId}, {
            $set: {
                password:hashResultNewPassword,
                hash:hashResultNewPassword
            }
        })
        return password.matchedCount === 1
},
    async getPasswordByUserId(userId:string):Promise<UserType|null>{
        return UserModel.findOne({id:userId},{_id: 0, __v: 0})
    }
}
