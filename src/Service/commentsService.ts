import {inputSortDataBaseType, PaginationTypePostInputCommentByPost} from "../RepositoryInDB/posts-repositoryDB";
import {Comment, CommentsRepository, OutputCommentOutputType} from "../RepositoryInDB/comments-repositoryDB";
import {CommentModel} from "../Models/shemaAndModel";

export class CommentsService{
    private commentsRepository = new CommentsRepository
    constructor(){
        this.commentsRepository = new CommentsRepository()
    }
    async getAllCommentForPostInBase(pagination:PaginationTypePostInputCommentByPost):
        Promise<inputSortDataBaseType<OutputCommentOutputType>>{
        return await this.commentsRepository.getComments(pagination)
    }
    async createCommentByPost(comment:Comment):Promise<OutputCommentOutputType> {
        return await this.commentsRepository.createCommentForPost(comment)
    }
    async getCommentOnId(id:string):Promise<Comment|null> {
        return this.commentsRepository.getComment(id)
    }
    async updateCommentOnId(id:string,content:string):Promise<boolean> {
        return await this.commentsRepository.updateComment(id,content)
    }
}