import {PostType} from "./posts-repositiryDB";

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

export function valueSortBy(sortBy:string) {
    return sortBy
}

