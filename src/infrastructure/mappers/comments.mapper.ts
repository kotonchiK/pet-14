import { CommentDocument, CommentTest } from "../domains/schemas/comments.schema";
import { likesInfo } from "../../features/comments/infrastructure/comments.query.repository";
import { OutputCommentModel } from "../../features/comments/api/models/output";
import { CommentsEntity } from "../../features/comments/infrastructure/domains/comments.entity";

export const commentMapper = (comment:CommentsEntity , likensInfo:likesInfo):OutputCommentModel => {
  return {
    id:comment.id.toString(),
    content:comment.content,
    commentatorInfo:{
      userId:comment.commentatorInfo.userId.toString(),
      userLogin:comment.commentatorInfo.userLogin
    },
    createdAt:comment.createdAt.toISOString(),
    likesInfo:{
      likesCount:likensInfo.likesCount,
      dislikesCount:likensInfo.dislikesCount,
      myStatus:likensInfo.myStatus
    }
  }
}
