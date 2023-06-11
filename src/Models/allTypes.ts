import {CommentatorInfo, LikesInfo} from "../RepositoryInDB/comment-repositoryDB";

export type PaginationTypeInputParamsBlogs = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1 | -1
}

export type PaginationTypeUpdateBlog = {
    idBlog :string
    nameBlog : string
    descriptionBlog : string
    websiteUrlBlog : string
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


export type PaginationTypeInputUser = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 1 | -1
    searchLoginTerm: string
    searchEmailTerm: string
}

export type PaginationTypeRecoveryPassword = {
    recoveryCode: string
    userId: string
    diesAtDate: string
}

export type OutputCommentOutputType ={
    id:string
    content:string
    commentatorInfo:CommentatorInfo
    createdAt:string
    likesInfo:LikesInfo
}

export const getPaginationValuesInputUserInformation = (ipAddress: any, userAgent: any): UserInformationType => {
    return {
        ipAddress: ipAddress,
        title: userAgent

    }
}
export type UserInformationType = {
    title: string,
    ipAddress: string,
}

export type InputUserNewType ={
    login:string
    password:string
    email:string
}