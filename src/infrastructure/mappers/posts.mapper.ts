import { PostDocument, PostTest } from "../domains/schemas/posts.schema";
import { OutputPostModel, postLikesInfo } from "../../features/posts/api/models/output";
import { PostsEntity } from "../../features/posts/infrastructure/domains/posts.entity";

export const postMapper = (post:PostTest | PostsEntity, postLikesInfo:postLikesInfo):OutputPostModel => {
  return {
    id:post.id.toString(),
    title:post.title,
    shortDescription:post.shortDescription,
    content:post.content,
    blogId:post.blogId.toString(),
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