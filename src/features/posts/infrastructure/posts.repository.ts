import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { CreatePostDto, PostDb } from "../api/models/input";
import { Post, PostDocument, PostLikes, PostLikesDocument } from "../../../infrastructure/domains/schemas/posts.schema";
import { statusType } from "../../../base/models/likeStatusDto";
import { PostsQueryRepository } from "./posts.query.repository";
import { User, UserDocument } from "../../../infrastructure/domains/schemas/users.schema";

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel:Model<PostDocument>,
              @InjectModel(PostLikes.name) private postLikesModel:Model<PostLikesDocument>,
              @InjectModel(User.name) public userModel:Model<UserDocument>,
              private postQueryRepo:PostsQueryRepository) {}
  async createPost(newPost:PostDb):Promise<PostDocument | null> {
    try {
      const createdPost = new this.postModel(newPost)

      await createdPost.save()

      return createdPost
    } catch (e) {
      console.log('Create-Post error => ', e)
      return null
    }
  }

  async updatePost(postId:string, dto:CreatePostDto):Promise<void> {
    try {
      await this.postModel.findByIdAndUpdate(new ObjectId(postId), dto)
    } catch (e) {
      console.log('Post-Update error => ', e)
    }
  }


  async deletePost(id:string):Promise<void> {
    try {
      await this.postModel.findByIdAndDelete(new ObjectId(id))
    } catch (e) {
      console.log('Delete-Post error => ', e)
    }
  }

  async updateLikeStatus(dto:statusType):Promise<boolean>{
    try {
      const post = await this.postQueryRepo.getPostById(dto.id, dto.userId)
      if(!post) return false

      const obWarUser = await this.postLikesModel.findOne({postId:dto.id, userId:dto.userId}).lean()
      if(!obWarUser) {
        const user = await this.userModel.findById({_id:new ObjectId(dto.userId)}).lean()
        const userData = {
          userId:dto.userId,
          postId:dto.id,
          status:dto.status,
          login:user!.login,
          addedAt:new Date()
        }
        const addNewUser = await this.postLikesModel.create(userData);
        return !!addNewUser
      }
      if(dto.status !== obWarUser.status) {
        const updateUserStatus = await this.postLikesModel.findOneAndUpdate(
          { postId: dto.id, userId: dto.userId },
          { $set: { status: dto.status,
              addedAt:new Date()} }
        );
        return !!updateUserStatus
      }

      return true
    } catch (e) {
      console.log('update like status for post => ', e)
      return false
    }


  }

}