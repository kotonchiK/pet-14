export type OutputPostModel = {
  id:string,
  title:string
  shortDescription:string,
  content:string,
  createdAt:string,
  blogId:string
  blogName:string
  extendedLikesInfo:extendedLikesInfo
}

type extendedLikesInfo = {
  likesCount:number
  dislikesCount:number
  myStatus:string
  newestLikes:newestLikes[]
}

type newestLikes = {
  addedAt:Date
  userId:string
  login:string
}

export type postLikesInfo = {
  likesCount:number
  dislikesCount:number
  myStatus: "None" | "Dislike" | "Like"
  newestLikes: newestLikes[]
}