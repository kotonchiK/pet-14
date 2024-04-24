import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { OutputCommentModel } from "../api/models/output";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { statusType } from "../../../base/models/likeStatusDto";

@Injectable()
export class CommentsService {
  constructor(private commentsQueryRepository:CommentsQueryRepository,
              private postQueryRepository:PostsQueryRepository,
              private commentRepository:CommentsRepository,
              private userQueryRepository:UsersQueryRepository

              ) {}

  async getCommentById(commentId:number, userId:number):Promise<OutputCommentModel> {
    const comment = await this.commentsQueryRepository.isComment(commentId)
    if(!comment) throw new NotFoundException('Post is not exist')

    return await this.commentsQueryRepository.getCommentById(commentId, userId)
  }

  async createComment(postId:number, userId:number, dto:string):Promise<OutputCommentModel>{
    const post = await this.postQueryRepository.isPost(postId)
    if(!post) throw new NotFoundException('Post is not Exist')

    const user = await this.userQueryRepository.getUser(userId)
    if(!user) throw new NotFoundException('User is not exist')

    const createdCommentId = await this.commentRepository.createComment(postId, user, dto)

    if(!createdCommentId) throw new BadRequestException({message:'Comment was not created', field:'comment'})

    const comment = await this.commentsQueryRepository.getCommentById(createdCommentId, userId)
    if(!comment) throw new NotFoundException('Comment was not founded')

    return comment
  }

  async updateComment(commentId:number, userId:number, content:string):Promise<void>{

    const comment = await this.commentsQueryRepository.getCommentById(commentId, userId)
    if(!comment) throw new NotFoundException('Comment is not exist')

    if(userId !== Number(comment.commentatorInfo.userId)) throw new ForbiddenException('the comment does not belong to the user')

    await this.commentRepository.updateComment(commentId, content)
  }
  async deleteComment(commentId:number, userId:number):Promise<void>{

    const comment = await this.commentsQueryRepository.getCommentById(commentId, userId)
    if(!comment) throw new NotFoundException('Comment is not exist')

    if(userId !== Number(comment.commentatorInfo.userId)) throw new ForbiddenException('the comment does not belong to the user')

    await this.commentRepository.deleteComment(commentId)
  }

  async setLikeStatus(dto:statusType):Promise<void> {
    const isComment = await this.commentsQueryRepository.isComment(dto.id)
    if(!isComment) throw new NotFoundException('Comment is not exist')

    const likeStatus = await this.commentRepository.updateLikeStatus(dto)

    if(!likeStatus) throw new BadRequestException({message:'Status was not updated', field:'likeStatus'})
  }




}