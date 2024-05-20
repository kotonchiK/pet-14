import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentsEntity, CommentsLikesEntity } from "../domains/comments.entity";
import { OutputCommentModel } from "../../api/models/output";
import { NotFoundException } from "@nestjs/common";
import { commentMapper } from "../../../../infrastructure/mappers/comments.mapper";
import { PostQueryModel } from "../../../posts/api/models/input";
import { Pagination } from "../../../../base/types/pagination.type";

export class CommentsQueryRepository_TYPEORM {
  constructor(
    @InjectRepository(CommentsEntity) private commentsRepository:Repository<CommentsEntity>,
    @InjectRepository(CommentsLikesEntity) private commentsLikesRepository:Repository<CommentsLikesEntity> ) {}

  async getCommentsForPost(sortData:PostQueryModel, postId:number, userId:number):Promise<Pagination<OutputCommentModel>>{
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData

    const [comments, totalCount] = await this.commentsRepository.findAndCount({
      where: { postId },
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    const pagesCount:number = Math.ceil(totalCount / pageSize)

    let sortComments:OutputCommentModel[] = []
    for(let i:number = 0; i < comments.length; i++) {
      const comment = comments[i]
      const likesInfo:likesInfo = await this.likesInfo(comment.id, userId)
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


  async getCommentById(commentId:number, userId:number):Promise<OutputCommentModel> {
    const comment = await this.commentsRepository.findOne({where:{id:commentId}})
    if(!comment) throw new NotFoundException('Comment is not exist')
    const likesInfo = await this.likesInfo(commentId, userId)

    return commentMapper(comment, likesInfo)
  }

   async likesInfo(commentId:number, userId: number):Promise<likesInfo> {
     const likesArray = await this.commentsLikesRepository.find({where:{commentId:commentId}})
     if(likesArray.length === 0) {
      return {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None"
      }
    }
     let status = "None"

    if(userId> 0) {
      const user = likesArray.map((like) =>  {
        if (like.userId === userId) return like
        else {
          return null
        }
      });
      if (user[0]) status = user[0].status;
    }

    let likes: number = 0;
    let dislikes: number = 0;
    likesArray.forEach(userLike => {
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

  async isComment(commentId: number): Promise<boolean> {
    try {
      const comment = await this.commentsRepository.findOne({where:{id:commentId}});
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