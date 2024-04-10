import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "../../../infrastructure/domains/schemas/blogs.schema";
import { Post, PostDocument, PostLikes, PostLikesDocument } from "../../../infrastructure/domains/schemas/posts.schema";
import { Comment, CommentDocument } from "../../../infrastructure/domains/schemas/comments.schema";
import {
  passwordChange,
  passwordChangeDocument,
  Tokens,
  TokensDocument,
  User,
  UserDocument
} from "../../../infrastructure/domains/schemas/users.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TestingService {
  constructor(@InjectModel(Blog.name) private blogModel:Model<BlogDocument>,
              @InjectModel(Post.name) private postModel:Model<PostDocument>,
              @InjectModel(Comment.name) private commentModel:Model<CommentDocument>,
              @InjectModel(User.name) private userModel:Model<UserDocument>,
              @InjectModel(PostLikes.name) private postLikesModel:Model<PostLikesDocument>,
              @InjectModel(Tokens.name) private tokensModel:Model<TokensDocument>,
              @InjectModel(passwordChange.name) private passwordChangeModel:Model<passwordChangeDocument>,


  ) {}
  async deleteAllData():Promise<void>{
    await this.blogModel.deleteMany()
    await this.postModel.deleteMany()
    await this.commentModel.deleteMany()
    await this.userModel.deleteMany()
    await this.postLikesModel.deleteMany()
    await this.tokensModel.deleteMany()
    await this.passwordChangeModel.deleteMany()
  }
}