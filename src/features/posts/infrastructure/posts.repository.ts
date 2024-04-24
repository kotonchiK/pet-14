import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { CreatePostDto, PostDb } from "../api/models/input";
import {
  Post,
  PostDocument,
  PostLikes,
  PostLikesDocument, PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { statusType } from "../../../base/models/likeStatusDto";
import { PostsQueryRepository } from "./posts.query.repository";
import { User, UserDocument, UserTest } from "../../../infrastructure/domains/schemas/users.schema";
import { InjectModel } from "@nestjs/sequelize";
import { where } from "sequelize";

export class PostsRepository {
  constructor(@InjectModel(PostTest) private postModel:typeof PostTest,
              @InjectModel(PostLikesTest) private postLikesModel:typeof PostLikesTest,
              @InjectModel(UserTest) public userModel:typeof UserTest,
              private postQueryRepo:PostsQueryRepository) {}
  async createPost(newPost:PostDb):Promise<PostTest | null> {
    try {
      return await this.postModel.create(newPost)
    } catch (e) {
      console.log('Create-Post error => ', e)
      return null
    }
  }

  async updatePost(postId:number, dto:CreatePostDto):Promise<void> {
    try {
      const post = await this.postModel.findByPk(postId)
      await post.update(dto)
    } catch (e) {
      console.log('Post-Update error => ', e)
    }
  }


  async deletePost(id:number):Promise<void> {
    try {
      const post = await this.postModel.findByPk(id)
      await post.destroy()
    } catch (e) {
      console.log('Delete-Post error => ', e)
    }
  }

  async updateLikeStatus(dto:statusType):Promise<boolean>{
    try {
      const post = await this.postQueryRepo.getPostById(dto.id, dto.userId)
      if(!post) return false

      let obWarUser = await this.postLikesModel.findOne({where:{postId:dto.id, userId:dto.userId}})
      if(!obWarUser) {
        const user = await this.userModel.findByPk(dto.userId)
        const userData = {
          userId:dto.userId,
          postId:dto.id,
          status:dto.status,
          login:user!.login,
          addedAt:new Date()
        }
        await this.postLikesModel.create(userData);
      } else if (dto.status !== obWarUser.status) {
        await obWarUser.update({ status: dto.status, addedAt: new Date() })
      }

      return true
    } catch (e) {
      console.log('update like status for post => ', e)
      return false
    }
  }

}