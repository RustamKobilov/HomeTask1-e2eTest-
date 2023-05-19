import {
    PaginationTypeAddNewUser,
    PaginationTypeInputUser, PaginationTypeRecoveryPassword,
    User,
    UserRepository
} from "../RepositoryInDB/user-repositoryDB";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {inputSortDataBaseType} from "../RepositoryInDB/post-repositoryDB";

export class UserService {
    constructor(protected userRepository: UserRepository) {
    }

    async createUser(paginationAddUser: PaginationTypeAddNewUser): Promise<User> {
        const salt = await bcrypt.genSalt(8)
        const hashResult = await this.userRepository.hashPassword(paginationAddUser.password, salt)

        const date0 = new Date()
        const date02 = date0.getHours()
        date0.setHours(date02 + 1)
        const dateExpiration = new Date(date0).toISOString()

        const newUser: User = new User(randomUUID(),
            paginationAddUser.login,
            hashResult,
            paginationAddUser.email,
            new Date().toISOString(),
            salt,
            hashResult,
            {
                userConformation: false,
                code: randomUUID(),
                expirationCode: dateExpiration
            })

        return newUser
    }

    async createUserByAdmin(paginationAddUser: PaginationTypeAddNewUser): Promise<User> {
        const userByAdmin = await this.createUser(paginationAddUser)
        userByAdmin.userConfirmationInfo.userConformation = true
        await this.userRepository.createUser(userByAdmin)
        return userByAdmin
    }

    async getAllUsers(paginationUser: PaginationTypeInputUser): Promise<inputSortDataBaseType<User>> {
        return await this.userRepository.getUsers(paginationUser)
    }

    async createUserRegistration(paginationAddUser: PaginationTypeAddNewUser): Promise<User> {
        const userRegistration = await this.createUser(paginationAddUser)
        await this.userRepository.createUser(userRegistration)
        return userRegistration
    }

    async deleteUserById(id: string): Promise<undefined> {
        const user = await this.userRepository.findUserById(id)
        if (!user) {
            return undefined
        }
        await this.userRepository.deleteUser(user.id)
    }

    async updatePasswordForUserByRecovery(newPassword: string, recoveryCode: string):
        Promise<boolean> {
        return await this.userRepository.updatePassword(newPassword, recoveryCode)
    }

    async createRecoveryPasswordUserItem(paginationRecoveryPassword: PaginationTypeRecoveryPassword) {
        await this.userRepository.createRecoveryPassword(paginationRecoveryPassword)
    }
}