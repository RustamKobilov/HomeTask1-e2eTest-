import {IReaction, ReactionModel} from "../Models/shemaAndModel";

export const helper= {
      getPaginationFunctionSkipSortTotal (pageNumber: number, pageSize: number,countFromDb: number) {
        return {
            skipPage: (pageNumber - 1) * pageSize,
            totalCount: Math.ceil(countFromDb / pageSize)
        }
    },
    async getReactionUserForParent (parentId:string,userId:string):Promise<IReaction|null>{
          const reaction = await ReactionModel.findOne({parentId:parentId,userId:userId}/*,{'status':1}*/)
          return reaction
    }
}

export type ReturnDistributedDate<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

