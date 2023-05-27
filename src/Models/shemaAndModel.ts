import mongoose from "mongoose";
import {likeStatus} from "./Enums";

const blogCollectionName = 'Blogs'
const postCollectionName = 'Posts'
const userCollectionName = 'Users'
const deviceCollectionName = 'Devices'
const commentCollectionName = 'Comments'
const attemptAccessEndpointCollectionName = 'AttemptAccessEndpoint'
const recoveryPasswordCollectionName = 'recoveryCodePasswordForUser'
const reactionCollectionName = 'ReactionModel'



export interface IBlog {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export const blogSchema = new mongoose.Schema<IBlog>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})

export const BlogModel = mongoose.model(blogCollectionName, blogSchema)



export interface IReaction {
    parentId: string,
    userId: string,
    userLogin: string,
    status: likeStatus
    createdAt: string
}

const ReactionSchema = new mongoose.Schema<IReaction>({
    parentId: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin : {type: String, required: true},
    status: {type: String, enum: likeStatus, required: true},
    createdAt: {type: String, required: true}
})



export const ReactionModel = mongoose.model<IReaction>(reactionCollectionName, ReactionSchema)



export interface IPost {
    id: string,
    title: string,
    shortDescription:string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

const postSchema = new mongoose.Schema<IPost>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model(postCollectionName, postSchema)



export interface ICommentatorInfo {
    userId: string,
    userLogin:string
}

const commentatorInfoSchema = new mongoose.Schema<ICommentatorInfo>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

export interface ILikesInfo {
    likesCount: number,
    dislikesCount: number,
    myStatus: likeStatus
}

const likesInfoSchema = new mongoose.Schema<ILikesInfo>({
    likesCount:{type: Number, required: true},
    dislikesCount:{type: Number, required: true},
    myStatus:{type: String, enum: likeStatus,required: true}
})

export interface IComment {
    postId: string,
    id: string,
    content: string,
    commentatorInfo: ICommentatorInfo,
    createdAt: string,
    likesInfo: ILikesInfo
}

const commentSchema = new mongoose.Schema({
    postId: {type: String, required: true},
    id: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: commentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    likesInfo: {type: likesInfoSchema, required: true}
})

export const CommentModel = mongoose.model(commentCollectionName, commentSchema)



export interface IUserInfo {
    userConformation: boolean,
    code: string,
    expirationCode: string
}

const userConfirmationInfoSchema = new mongoose.Schema<IUserInfo>({
    userConformation: {type: Boolean, required: true},
    code: {type: String, required: true},
    expirationCode: {type: String, required: true}
})



export interface IUser {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string,
    salt: string,
    hash: string,
    userConfirmationInfo: IUserInfo
}

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    userConfirmationInfo: {type: userConfirmationInfoSchema, required: true}
})

export const UserModel = mongoose.model(userCollectionName, userSchema)



export interface IDevice {
    userId: string,
    lastActiveDate: string,
    diesAtDate: string,
    deviceId: string,
    title: string,
    ip: string
}

const deviceSchema = new mongoose.Schema<IDevice>({
    userId: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    diesAtDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    title: {type: String, required: true},
    ip: {type: String, required: true}
})

export const DeviceModel = mongoose.model(deviceCollectionName, deviceSchema)



export interface IAttemptLoginEndPoint {
    endpointName: string,
    ip: string,
    dateAttempt: string
}

const attemptAccessEndpoint = new mongoose.Schema<IAttemptLoginEndPoint>({
    endpointName: {type: String, required: true},
    ip: {type: String, required: true},
    dateAttempt: {type: String, required: true}
})

export const AttemptModel = mongoose.model(attemptAccessEndpointCollectionName, attemptAccessEndpoint)



export interface IRecoveryPassword {
    recoveryCode: string,
    userId: string,
    diesAtDate: string
}

const recoveryCodePasswordForUserSchema = new mongoose.Schema<IRecoveryPassword>({
    recoveryCode: {type: String, required: true},
    userId: {type: String, required: true},
    diesAtDate: {type: String, required: true}
})

export const RecoveryPasswordModel = mongoose.model(recoveryPasswordCollectionName, recoveryCodePasswordForUserSchema)
