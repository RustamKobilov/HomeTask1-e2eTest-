import {PostType} from "./posts-repositiryDB";
import {BlogsType} from "./blog-repositoryDB";

export function valueSortDirection(value:string){
    return value=='desc'?-1:1
}

export function skipPageMath (pageNumber:number,pageSize:number):number{
    const skipPage=(pageNumber-1)*pageSize;
    return skipPage
}

export function countPageMath(countPage:number,pageSize:number){
    return Math.ceil(countPage/pageSize)
}

export type ReturnDistributedDate<T>={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}