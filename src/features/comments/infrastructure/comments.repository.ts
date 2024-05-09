import { Model } from "mongoose";
import { Comment, CommentDocument, CommentTest } from "../../../infrastructure/domains/schemas/comments.schema";
import { OutputUserModel } from "../../users/api/models/output";
import { ObjectId } from "mongodb";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { statusType } from "../../../base/models/likeStatusDto";
import { InjectModel } from "@nestjs/sequelize";

export class CommentsRepository {
  constructor(@InjectModel(CommentTest) private commentModel:typeof CommentTest) {}

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
        usersLikes: []
      }
      const comment = await this.commentModel.create(InputData)
      return comment.id
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateComment(id:number, content:string):Promise<void> {
    try {
      const comment = await this.commentModel.findByPk(id)

      await comment.update({"content":content})
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
      const comment = await this.commentModel.findByPk(id)
      await comment.destroy()
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
      const comment = await this.commentModel.findByPk(data.id)
      if(!comment) return false

      const obWarUser = comment.usersLikes.find(like => like.userId === data.userId);
      // юзера нет
      if(!obWarUser) {
        const newUserLike = {
          userId: data.userId,
          status: data.status
        };
        comment.usersLikes.push(newUserLike);
      } else {
        obWarUser.status = data.status;
      }

        await comment.save();
        return true
    } catch (error) {
      console.log(error)
      return false
    }
  }


}