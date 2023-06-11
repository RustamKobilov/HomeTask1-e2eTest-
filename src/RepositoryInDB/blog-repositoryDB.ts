import {Post, PostRepository} from "./post-repositoryDB";
import {helper, ReturnDistributedDate} from "../Service/helper";
import {BlogModel, IBlog, IPost, IUser, PostModel} from "../Models/shemaAndModel";
import {inject, injectable} from "inversify";
import {
    inputSortDataBaseType,
    PaginationTypeInputParamsBlogs,
    PaginationTypeInputPosts,
    PaginationTypeUpdateBlog
} from "../Models/allTypes";


export class Blog {
    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean) {
    }
}


@injectable()
export class BlogRepository{
    constructor(@inject(PostRepository) protected postsRepository : PostRepository) {
    }
    async getBlogs(paginationBlogs: PaginationTypeInputParamsBlogs):
        Promise<ReturnDistributedDate<Blog>> {

        const filter={name: {$regex: paginationBlogs.searchNameTerm ?? '', $options: "i"}}

        const totalCountBlog =  await BlogModel.countDocuments(filter)

        const sortBy=paginationBlogs.sortBy
        const sortDirection=paginationBlogs.sortDirection
        const paginationFromHelperForBlogs=helper.getPaginationFunctionSkipSortTotal(paginationBlogs.pageNumber,paginationBlogs.pageSize, totalCountBlog)

        const blogs = await BlogModel.find(filter, {_id: 0, __v: 0}).sort({[sortBy]: sortDirection})
            .skip(paginationFromHelperForBlogs.skipPage)
            .limit(paginationBlogs.pageSize).lean()

        return {
            pagesCount: paginationFromHelperForBlogs.totalCount, page: paginationBlogs.pageNumber, pageSize: paginationBlogs.pageSize,
            totalCount: totalCountBlog, items: blogs
        }
    }
    async getPostsForBlog(paginationPosts: PaginationTypeInputPosts, blogId: string):
        Promise<inputSortDataBaseType<Post>> {

        const filter= {blogId: blogId}
        const countPostsForBlog = await PostModel.countDocuments(filter)
        const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, countPostsForBlog)

        let sortPostsForBlogs = await PostModel.find(filter, {_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
        skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

        return {
            pagesCount: paginationFromHelperForPosts.totalCount,
            page: paginationPosts.pageNumber,
            pageSize: paginationPosts.pageSize,
            totalCount: countPostsForBlog,
            items: sortPostsForBlogs
        }
    }

    async getPostsForBlogbyUser(paginationPosts: PaginationTypeInputPosts, blogId: string,user:IUser):
        Promise<inputSortDataBaseType<IPost>> {

        const filter= {blogId: blogId}
        const countPostsForBlog = await PostModel.countDocuments(filter)
        const paginationFromHelperForPosts=helper.getPaginationFunctionSkipSortTotal(paginationPosts.pageNumber,paginationPosts.pageSize, countPostsForBlog)

        let postsForBlogs = await PostModel.find(filter, {_id: 0, __v: 0}).sort({[paginationPosts.sortBy]: paginationPosts.sortDirection}).
        skip(paginationFromHelperForPosts.skipPage).limit(paginationPosts.pageSize).lean()

        const resulPostsAddLikes = await Promise.all(postsForBlogs.map(async (post:IPost)=>{
            const postUpgrade = await this.postsRepository.mapPost(post)
            const searchReaction = await helper.getReactionUserForParent(postUpgrade.id,user.id)
            if(!searchReaction){
                return post
            }
            postUpgrade.extendedLikesInfo.myStatus = searchReaction.status

            return postUpgrade
        }))


        return {
            pagesCount: paginationFromHelperForPosts.totalCount,
            page: paginationPosts.pageNumber,
            pageSize: paginationPosts.pageSize,
            totalCount: countPostsForBlog,
            items: resulPostsAddLikes
        }
    }

    async createBlog(Blog:IBlog){
       return await BlogModel.insertMany(Blog);
    }
    async findBlog(id: string): Promise<IBlog | null> {
       return await BlogModel.findOne({id: id}, {_id: 0, __v: 0});
    }
    async updateBlog(paginationUpdateBlog:PaginationTypeUpdateBlog):
        Promise<boolean> {
        let blog = await BlogModel.updateOne({id: paginationUpdateBlog.idBlog}, {
            $set: {
                name: paginationUpdateBlog.nameBlog,
                websiteUrl: paginationUpdateBlog.websiteUrlBlog,
                description: paginationUpdateBlog.descriptionBlog
            }
        })
        return blog.matchedCount === 1
    }
}

