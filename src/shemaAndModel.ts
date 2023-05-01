import mongoose from "mongoose";

const blogCollectionName='Blogs'
const postCollectionName='Posts'
const userCollectionName='Users'
const deviceCollectionName='Devices'
const commentCollectionName='Comments'
const attemptAccessEndpointCollectionName='AttemptAccessEndpoint'
export const blogSchema = new mongoose.Schema({
    id: {type:String,required:true},
    name: {type:String,required:true},
    description: {type:String,required:true},
    websiteUrl: {type:String,required:true},
    createdAt: {type:String,required:true},
    isMembership: {type:Boolean,required:true},
})

export const BlogModel = mongoose.model(blogCollectionName, blogSchema)

const postSchema = new mongoose.Schema({
    id: {type:String,required:true},
    title: {type:String,required:true},
    shortDescription: {type:String,required:true},
    content: {type:String,required:true},
    blogId:{type:String,required:true},
    blogName: {type:String,required:true},
    createdAt: {type:String,required:true}
})

export const PostModel=mongoose.model(postCollectionName,postSchema)

const commentSchema=new mongoose.Schema({
    postId:{type:String,required:true},
    id:{type:String,required:true},
    content:{type:String,required:true},
    commentatorInfo:{userId:{type:String,required:true}, userLogin:{type:String,required:true},required:true},
    createdAt:{type:String,required:true}
})

export const CommentModel=mongoose.model(commentCollectionName,commentSchema)


const userSchema= new mongoose.Schema({
    id:{type:String,required:true},
    login:{type:String,required:true},
    password:{type:String,required:true},
    email: {type:String,required:true},
    createdAt: {type:String,required:true},
    salt: {type:String,required:true},
    hash: {type:String,required:true},
    userConfirmationInfo:{
        userConformation:{type:Boolean,required:true},
        code:{type:String,required:true},
        expirationCode:{type:String,required:true},required:true
    }
})

export const UserModel=mongoose.model(userCollectionName,userSchema)

const deviceSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    lastActiveDate:{type:String,required:true},
    diesAtDate:{type:String,required:true},
    deviceId:{type:String,required:true},
    deviceName:{type:String,required:true},
    ip:{type:String,required:true}
})

export const DeviceModel=mongoose.model(deviceCollectionName,deviceSchema)

const attemptAccessEndpoint = new mongoose.Schema({
    endPointName:{type:String,required:true},
    ip:{type:String,required:true},
    dateAttempt:{type:String,required:true}
})

export const AttemptModel=mongoose.model(attemptAccessEndpointCollectionName,attemptAccessEndpoint)

