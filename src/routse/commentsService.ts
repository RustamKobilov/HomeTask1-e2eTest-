import {getCommentOnId, InputCommentByIdType} from "../RepositoryInDB/commentator-repositoryDB";

export const commentsService={
 async checkCommentsUser(userId:string,commentId:string){
  const resultSearch=await getCommentOnId(commentId)
  if(!resultSearch){
   return false;
  }
  if(resultSearch.commentatorInfo.userId!==userId){
   return false;
  }
  return true;
 }
}