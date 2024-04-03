import { CommentDocument } from "../domains/schemas/comments.schema";
import { likesInfo } from "../../features/comments/infrastructure/comments.query.repository";
import { OutputCommentModel } from "../../features/comments/api/models/output";

export const commentMapper = (comment:CommentDocument, likensInfo:likesInfo):OutputCommentModel => {
  return {
    id:comment._id.toString(),
    content:comment.content,
    commentatorInfo:{
      userId:comment.commentatorInfo.userId,
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
