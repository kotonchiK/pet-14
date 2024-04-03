import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { OutputCommentModel } from "../api/models/output";

@Injectable()
export class CommentsService {
  constructor(private commentsQueryRepository:CommentsQueryRepository,

              ) {}

  async getCommentById(commentId:string, userId:string):Promise<OutputCommentModel> {
    const comment = await this.commentsQueryRepository.isComment(commentId)
    if(!comment) throw new NotFoundException('Post is not exist')

    return await this.commentsQueryRepository.getCommentById(commentId, userId)
  }


}