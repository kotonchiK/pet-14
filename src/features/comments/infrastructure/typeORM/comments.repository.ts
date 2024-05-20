import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentsEntity, CommentsLikesEntity } from "../domains/comments.entity";
import { statusType } from "../../../../base/models/likeStatusDto";
import { OutputUserModel } from "../../../users/api/models/output";

export class CommentsRepository_TYPEORM {
  constructor(@InjectRepository(CommentsEntity) private commentsRepository:Repository<CommentsEntity>,
              @InjectRepository(CommentsLikesEntity) private commentsLikesRepository:Repository <CommentsLikesEntity>,
              ) {}

  async createComment(postId:number, user:OutputUserModel, dto:string):Promise<number|null>{
    try {
      const InputData = {
        content: dto,
        commentatorInfo: {
          userId:Number(user.id),
          userLogin:user.login
        },
        createdAt: new Date(),
        postId: postId,
      }
      const comment = await this.commentsRepository.save(InputData)
      return comment.id
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateComment(id:number, content:string):Promise<void> {
    try {
      const comment = await this.commentsRepository.findOne({where:{id:id}})
      comment.content = content
      await this.commentsRepository.save(comment)
    } catch (error) {
      console.log({
        'Error by update comment => ':error,
        Place:'CommentRepository',
        Method:'updateComment'})
      throw new BadRequestException({message:'Comment was not updated', field:'comment'})
    }
  }

  async deleteComment(id:number):Promise<void>{
    try {
      const comment = await this.commentsRepository.findOne({where:{id:id}})
      await this.commentsRepository.remove(comment)
    } catch (error) {
      console.log({
        'Error by delete comment => ':error,
        Place:'CommentRepository',
        Method:'deleteComment'})
      throw new BadRequestException({message:'Comment was not deleted', field:'comment'})
    }
  }
  async updateLikeStatus(data:statusType):Promise<boolean>{
    try {
      const comment = await this.commentsRepository.findOne({where:{id:data.id}})
      if(!comment) return false

      const obWarUser = await this.commentsLikesRepository.findOne({where:{commentId:data.id, userId:data.userId}})

      // юзера нет
      if(!obWarUser) {
        const newUserLike = {
          commentId: data.id,
          userId: data.userId,
          status: data.status
        };
        await this.commentsLikesRepository.save(newUserLike)
      } else {
        obWarUser.status = data.status;
        await this.commentsLikesRepository.save(obWarUser)
      }

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }


}