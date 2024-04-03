import { PostDocument } from "../domains/schemas/posts.schema";
import { OutputPostModel, postLikesInfo } from "../../features/posts/api/models/output";

export const postMapper = (post:PostDocument, postLikesInfo:postLikesInfo):OutputPostModel => {
  return {
    id:post._id.toString(),
    title:post.title,
    shortDescription:post.shortDescription,
    content:post.content,
    blogId:post.blogId,
    blogName:post.blogName,
    createdAt:post.createdAt.toISOString(),
    extendedLikesInfo:{
      likesCount:postLikesInfo.likesCount,
      dislikesCount:postLikesInfo.dislikesCount,
      myStatus:postLikesInfo.myStatus,
      newestLikes:postLikesInfo.newestLikes
    }
  }
}