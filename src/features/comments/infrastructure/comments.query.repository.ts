import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import {  OutputCommentModel } from "../api/models/output";
import { Comment, CommentDocument } from "../../../infrastructure/domains/schemas/comments.schema";
import { commentMapper } from "../../../infrastructure/mappers/comments.mapper";
import { PostQueryModel } from "../../posts/api/models/input";
import { Pagination } from "../../../base/types/pagination.type";

export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel:Model<CommentDocument>) {}


  async getCommentsForPost(sortData:PostQueryModel, postId:string, userId:string):Promise<Pagination<OutputCommentModel>>{
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {postId:postId}
    const comments = await this.commentModel
      .find(filter)
      .sort({[sortBy]:sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
    const totalCount:number = await this.commentModel.countDocuments(filter)
    const pagesCount:number = Math.ceil(totalCount / pageSize)

    let sortComments:OutputCommentModel[] = []
    for(let i:number = 0; i < comments.length; i++) {
      const comment = comments[i]
      const likesInfo:likesInfo = await this.likesInfo(comment, userId)
      const sortedComment:OutputCommentModel = commentMapper(comment, likesInfo)
      sortComments.push(sortedComment)
    }

    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items:sortComments
    }
  }


  async getCommentById(commentId:string, userId:string):Promise<OutputCommentModel> {
    const comment = await this.commentModel.findById(new ObjectId(commentId))

    const likesInfo = await this.likesInfo(comment, userId)

    return commentMapper(comment, likesInfo)
  }

   async likesInfo(comment: CommentDocument, userId: string):Promise<likesInfo> {
    if(comment.usersLikes.length === 0) {
      return {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None"
      }
    }

    const isUserId: string[] = userId.split('')
    let status = "None"

    if(isUserId.length > 1) {
      const user = comment.usersLikes.map((like) =>  {
        if (like.userId === userId) return like
        else {
          return null
        }
      });
      if (user[0]) status = user[0].status;
    }

    let likes: number = 0;
    let dislikes: number = 0;
    comment.usersLikes.forEach(userLike => {
      if (userLike.status === "Like") {
        likes++;
      } else if (userLike.status === "Dislike") {
        dislikes++;
      }
    });

    return {
      likesCount: likes,
      dislikesCount: dislikes,
      myStatus: status
    } as likesInfo
  }

  async isComment(commentId: string): Promise<boolean> {
    try {
      const comment = await this.commentModel.findById(new ObjectId(commentId));
      return !!comment;
    } catch (error) {
      console.log(`Error while checking blog: ${error}`);
      return false;
    }
  }
}


export type likesInfo = {
  likesCount:number
  dislikesCount:number
  myStatus: "None" | "Dislike" | "Like"
}