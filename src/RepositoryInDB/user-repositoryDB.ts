import bcrypt from 'bcrypt'
import {helper} from "../Service/helper";
import {inputSortDataBaseType} from "./post-repositoryDB";
import {IUser, RecoveryPasswordModel, UserModel} from "../Models/shemaAndModel";
import { injectable } from 'inversify';

export class User{
    constructor( public id: string,
    public login: string,
    public password: string,
   public email: string,
    public createdAt: string,
   public salt: string,
    public hash: string,
    public userConfirmationInfo: {
        userConformation: boolean
        code: string,
        expirationCode: string
    }){}
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
    sortDirection: 1 | -1
    searchLoginTerm: string
    searchEmailTerm: string
}

export type PaginationTypeAddNewUser = {
    login: string
    password: string
    email: string
}

export type PaginationTypeRecoveryPassword = {
    recoveryCode: string
    userId: string
    diesAtDate: string
}


@injectable()
export class UserRepository{
    async getUsers(paginationUser: PaginationTypeInputUser): Promise<inputSortDataBaseType<User>> {
        const searchLoginTerm = paginationUser.searchLoginTerm != null ? {
            login: {$regex: paginationUser.searchLoginTerm, $options: "i"}
        } : {}
        const searchEmailTerm = paginationUser.searchEmailTerm != null ? {
            email: {$regex: paginationUser.searchEmailTerm, $options: "i"}
        } : {}

        const totalCountUser =
            await UserModel.countDocuments({$or: [searchLoginTerm, searchEmailTerm]})


        const paginationFromHelperForUsers = helper.getPaginationFunctionSkipSortTotal(paginationUser.pageNumber,
            paginationUser.pageSize, totalCountUser)

        let sortUser = await UserModel.find({$or: [searchLoginTerm, searchEmailTerm]}
            , {
                _id: 0,
                __v: 0,
                hash: 0,
                salt: 0,
                password: 0,
                userConfirmationInfo: {_id: 0, __v: 0}
            }).sort({[paginationUser.sortBy]: paginationUser.sortDirection})
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
    async createUser(user:User){
        await UserModel.insertMany(user)
    }
    async hashPassword(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findOne({id: id}, {_id: 0, __v: 0})
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<IUser | null> {
        return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}, {_id: 0, __v: 0})
    }
    async findUserByCode(code: string): Promise<IUser | null> {
        return UserModel.findOne({'userConfirmationInfo.code': code}, {_id: 0, __v: 0})
    }
    async updateUserConformation(id: string):
        Promise<boolean> {
        let user = await UserModel.updateOne({id: id}, {
            $set: {
                'userConfirmationInfo.userConformation': true,

            }
        })

        return user.matchedCount === 1
    }
    async deleteUser(id: string){
        await UserModel.deleteOne({id: id})
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({email: email}, {_id: 0, __v: 0})
    }
    async findUserByLogin(login: string): Promise<IUser | null> {
        return UserModel.findOne({login: login}, {_id: 0, __v: 0})
    }
    async updateUserConformationCode(id: string, code: string):
        Promise<boolean> {
        let user = await UserModel.updateOne({id: id}, {
            $set: {
                'userConfirmationInfo.code': code,

            }
        })

        return user.matchedCount === 1
    }
    async getRecoveryCode(code: String): Promise<PaginationTypeRecoveryPassword | null> {
        return RecoveryPasswordModel.findOne({recoveryCode: code}, {_id: 0, __v: 0})
    }
    async updatePassword(newPassword: string, recoveryCode: string):
        Promise<boolean> {
        let userIdInRecovery = await this.getRecoveryCode(recoveryCode)
        if (!userIdInRecovery) {
            return false
        }
        const salt = await bcrypt.genSalt(8)
        const hashResultNewPassword = await this.hashPassword(newPassword, salt)

        let password = await UserModel.updateOne({id: userIdInRecovery.userId}, {
            $set: {
                password: hashResultNewPassword,
                hash: hashResultNewPassword,
                salt: salt
            }
        })
        return password.matchedCount === 1
    }
    async getPasswordByUserId(userId: string): Promise<IUser | null> {
        return UserModel.findOne({id: userId}, {_id: 0, __v: 0})
    }
    async createRecoveryPassword(paginationRecoveryPassword:PaginationTypeRecoveryPassword){
        await RecoveryPasswordModel.insertMany({
            recoveryCode: paginationRecoveryPassword.recoveryCode,
            userId: paginationRecoveryPassword.userId,
            diesAtDate: paginationRecoveryPassword.diesAtDate
        })
    }
}

export const userRepository=new UserRepository()
