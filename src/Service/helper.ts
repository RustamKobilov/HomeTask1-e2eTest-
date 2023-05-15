
export const helper= {
      getPaginationFunctionSkipSortTotal (pageNumber: number, pageSize: number,countFromDb: number) {
        return {
            skipPage: (pageNumber - 1) * pageSize,
            totalCount: Math.ceil(countFromDb / pageSize)
        }
    }
}

export type ReturnDistributedDate<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}