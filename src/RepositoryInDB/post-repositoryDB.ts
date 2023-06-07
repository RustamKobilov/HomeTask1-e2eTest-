import { helper} from "../Service/helper";
import {BlogModel, IPost, IReaction, PostModel} from "../Models/shemaAndModel";
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
    constructor (public likesCount :  number, public dislikesCount  : number, public myStatus :  likeStatus, public newestLikes: IReaction []=[] ){}
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
    async findPost(id: string): Promise<IPost | null> {
        let post = await PostModel.findOne({id: id},{_id: 0, __v: 0});
        return post;
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
}



