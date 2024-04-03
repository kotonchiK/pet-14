import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { CreatePostDto, PostDb } from "../api/models/input";
import { Post, PostDocument } from "../../../infrastructure/domains/schemas/posts.schema";

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel:Model<PostDocument>) {}
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
}