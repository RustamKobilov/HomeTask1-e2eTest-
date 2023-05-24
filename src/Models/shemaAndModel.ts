import mongoose, {mongo} from "mongoose";
import {likeStatus} from "./Enums";
import {ObjectId} from "mongodb";

const blogCollectionName = 'Blogs'
const postCollectionName = 'Posts'
const userCollectionName = 'Users'
const deviceCollectionName = 'Devices'
const commentCollectionName = 'Comments'
const attemptAccessEndpointCollectionName = 'AttemptAccessEndpoint'
const recoveryPasswordCollectionName = 'recoveryCodePasswordForUser'
const likesDislikeCollectionName = 'likesInfo'


export const blogSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})

export const BlogModel = mongoose.model(blogCollectionName, blogSchema)

const postSchema = new mongoose.Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model(postCollectionName, postSchema)

const usersStatusLikeAndDislike = new mongoose.Schema({
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true}
})

const likesSchema = new mongoose.Schema({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: {type: String, required: true},
    usersStatus: {type: [usersStatusLikeAndDislike], required: true}
})

const commentatorInfoSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

const commentSchema = new mongoose.Schema({
    postId: {type: String, required: true},
    id: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: commentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    likesInfo: {type: likesSchema, required: true}
})

export const CommentModel = mongoose.model(commentCollectionName, commentSchema)

const userConfirmationInfoSchema = new mongoose.Schema({
    userConformation: {type: Boolean, required: true},
    code: {type: String, required: true},
    expirationCode: {type: String, required: true}
})

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

const deviceSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    diesAtDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    title: {type: String, required: true},
    ip: {type: String, required: true}
})

export const DeviceModel = mongoose.model(deviceCollectionName, deviceSchema)

const attemptAccessEndpoint = new mongoose.Schema({
    endPointName: {type: String, required: true},
    ip: {type: String, required: true},
    dateAttempt: {type: String, required: true}
})

export const AttemptModel = mongoose.model(attemptAccessEndpointCollectionName, attemptAccessEndpoint)

const recoveryCodePasswordForUserSchema = new mongoose.Schema({
    recoveryCode: {type: String, required: true},
    userId: {type: String, required: true},
    diesAtDate: {type: String, required: true}
})

export const RecoveryPasswordModel = mongoose.model(recoveryPasswordCollectionName, recoveryCodePasswordForUserSchema)



export enum EReactionStatus {
    Like = 'Like',
    Dislike = "Dislike",
    None = "None"
}

export interface IReaction {
    parentId: string,
    userId: string,
    // userLogin: string,
    status: EReactionStatus
    createdAt: string

}

const ReactionSchema = new mongoose.Schema<IReaction>({
    parentId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, enum: EReactionStatus, required: true},
    createdAt: {type: String, required: true, default: new Date().toISOString}
})

export const ReactionModel = mongoose.model<IReaction>('ReactionModel', ReactionSchema)

// class L implements IReaction {
//     constructor(id: string) {
//     }
// }