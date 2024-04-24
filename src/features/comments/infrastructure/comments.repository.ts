import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../../../infrastructure/domains/schemas/comments.schema";
import { OutputUserModel } from "../../users/api/models/output";
import { ObjectId } from "mongodb";
import { BadRequestException } from "@nestjs/common";
import { statusType } from "../../../base/models/likeStatusDto";

export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel:Model<CommentDocument>) {}

  async createComment(postId:string, user:OutputUserModel, dto:string):Promise<string|null>{
    try {
      const InputData = {
        content: dto,
        commentatorInfo: {
          userId:user.id,
          userLogin:user.login
        },
        createdAt: new Date(),
        postId: postId,
        usersLikes: []
      }
      const comment = await this.commentModel.create(InputData)
      return comment._id.toString()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateComment(id:string, content:string):Promise<void> {
    try {
      await this.commentModel.findByIdAndUpdate(
        {_id:new ObjectId(id)},
        { $set:{
            content:content}})
    } catch (error) {
      console.log({
        'Error by update comment => ':error,
        Place:'CommentRepository',
        Method:'updateComment'})
      throw new BadRequestException({message:'Comment was not updated', field:'comment'})
    }
  }

  async deleteComment(id:string):Promise<void>{
    try {
      await this.commentModel.findByIdAndDelete({_id:new ObjectId(id)})
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
      const comment = await this.commentModel.findById({ _id: new ObjectId(data.id)}).lean()
      if(!comment) return false

      const obWarUser = comment.usersLikes.find(like => like.userId === data.userId);
      // юзера нет
      if(!obWarUser) {
        const addNewUser = await this.commentModel.updateOne(
          { _id: new ObjectId(data.id)},
          { $addToSet: { "usersLikes": {
                userId: data.userId,
                status: data.status
              }}});
        return !!addNewUser
      }
      // юзер естьь!!
      if(data.status !== obWarUser.status) {
        obWarUser.status = data.status
        const updateUserStatus = await this.commentModel.findOneAndUpdate(
          { _id: new ObjectId(data.id), "usersLikes.userId": data.userId },
          { $set: { "usersLikes.$.status": data.status }}
        );
        return !!updateUserStatus
      }
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }


}