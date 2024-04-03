export type OutputCommentModel = {
  id:string,
  content:string
  commentatorInfo:commentatorInfo,
  createdAt:string,
  likesInfo:likesInfo
}

type commentatorInfo = {
  userId:string
  userLogin:string
}

type likesInfo = {
  likesCount:number
  dislikesCount:number
  myStatus:string
}
