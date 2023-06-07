import { helper} from "../Service/helper";
import {
    BlogModel,
    CommentModel,
    IComment, INewestLikes,
    IPost,
    IReaction,
    IUser,
    PostModel,
    ReactionModel
} from "../Models/shemaAndModel";
import {Blog} from "./blog-repositoryDB";
import { injectable } from "inversify";
import {likeStatus} from "../Models/Enums";

export class Post {
    constructor(public id: string,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public extendedLikesInfo: LikesInfoPosts
    ) {}
}

export class LikesInfoPosts {
    constructor (public likesCount :  number, public dislikesCount  : number, public myStatus :  likeStatus, public newestLikes: INewestLikes []=[] ){}
}


export type inputSortDataBaseType<T> = {

    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type PaginationTypeInputPosts = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1|-1
}

export type PaginationTypeInputPostValueForPost={
    titlePost: string
    shortDescriptionPost: string
    contentPost: string
}

export type PaginationTypeGetInputCommentByPost ={
    idPost:string,
    content:string
}

export type PaginationTypePostInputCommentByPost={
    idPost:string,
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1|-1
}

@injectable()
export class PostRepository {
   async getPosts(paginationPosts: PaginationTypeInputPosts): Promise<inputSortDataBaseType<IPost>> {

        const pagesCountBlog = await PostModel.countDocuments({});

        const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, pagesCountBlog)

        const posts = await PostModel.find({},{_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
        skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

        return {
            pagesCount: paginationFromHelperForPosts.totalCount, page: paginationPosts.pageNumber, pageSize: paginationPosts.pageSize,
            totalCount: pagesCountBlog, items: posts
        };
    }

    async getPostsForUser(paginationPosts: PaginationTypeInputPosts,user:IUser): Promise<inputSortDataBaseType<IPost>> {

        const pagesCountBlog = await PostModel.countDocuments({});

        const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, pagesCountBlog)

        const posts = await PostModel.find({},{_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
        skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

        const resulPostsAddLikes = await Promise.all(posts.map(async (post:IPost)=>{
            const postUpgrade = await this.mapPost(post)
            const searchReaction = await helper.getReactionUserForParent(postUpgrade.id,user.id)
            if(!searchReaction){
                return post
            }
            postUpgrade.extendedLikesInfo.myStatus = searchReaction.status

            return postUpgrade
        }))

        return {
            pagesCount: paginationFromHelperForPosts.totalCount, page: paginationPosts.pageNumber, pageSize: paginationPosts.pageSize,
            totalCount: pagesCountBlog, items: posts
        }
    }
    async getPost(id: string): Promise<IPost | null> {
       console.log(id)
        return await PostModel.findOne({id: id},{_id: 0, __v: 0})
    }
    async getPostForUser(postId: string, user:IUser): Promise<IPost | false> {
        const postForUser = await PostModel.findOne({id: postId},{_id: false, __v: false})
        if(!postForUser){
            return false
        }
        const searchReaction = await helper.getReactionUserForParent(postId,user.id)
        if(!searchReaction){
            return postForUser
        }
        const postUpgrade = await this.mapPost(postForUser)
        postUpgrade.extendedLikesInfo.myStatus = searchReaction.status

        return postUpgrade
    }
    async updatePost(id: string, pagination:PaginationTypeInputPostValueForPost, blogId:string): Promise<boolean> {
        let post = await PostModel.updateOne({id: id}, {
            $set: {
                title: pagination.titlePost,
                shortDescription: pagination.shortDescriptionPost,
                content: pagination.contentPost,
                blogId: blogId
            }
        });

        return post.matchedCount === 1
    }
    async findBlogName(id: string): Promise<Blog | null> {
        return BlogModel.findOne({id:id},{_id: 0, __v: 0});
    }
    async createPost(post:IPost){
        await PostModel.insertMany(post);
    }
    async updateLikeStatusPost(post:IPost, newReaction:IReaction):Promise<boolean>{
        const findReaction = await ReactionModel.findOne({parentId: post.id})

        const updateReaction = await ReactionModel.updateOne({parentId: post.id,userId:newReaction.userId},
            {$set: {...newReaction}}
            , {upsert: true})

        const likesCount = await ReactionModel.countDocuments({parentId: post.id, status: likeStatus.Like})
        const dislikesCount = await ReactionModel.countDocuments({parentId: post.id, status: likeStatus.Dislike})

        const lastReactionUser = await ReactionModel.find({parentId: post.id, status:likeStatus.Like})
            .sort({createdAt:-1}).limit(3).lean()
        const lastlikeUser = await Promise.all(lastReactionUser.map(async (reaction:IReaction)=>{
            const newestLikes = await this.mapNewestLikes(reaction)
            return newestLikes
        }))
        const updateCountLike = await this.updateCountReactionPost(post,likesCount,dislikesCount,lastlikeUser)
        return updateCountLike
    }
    async updateCountReactionPost(post:IPost, countLikes : number , countDislike : number, lastLikeUser:INewestLikes[]):Promise<boolean> {
        console.log(countLikes)
        console.log(countDislike)
        const updateExtendedLikes = await PostModel.updateOne({id:post.id},{
            $set: {
                'extendedLikesInfo.likesCount': countLikes,
                'extendedLikesInfo.dislikesCount': countDislike,
                'extendedLikesInfo.newestLikes':lastLikeUser
            }
        })
        return updateExtendedLikes.matchedCount === 1
    }
    async mapPost(post:IPost) {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: post.extendedLikesInfo
        }
    }
       async mapNewestLikes(reaction:IReaction){
           return {
               addedAt: reaction.createdAt,
               userId: reaction.userId,
               login: reaction.userLogin
           }
        }
}



