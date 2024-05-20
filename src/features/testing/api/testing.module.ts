import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogFeature, BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import {
  PostFeature,
  PostLikesFeature,
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { CommentFeature, CommentTest } from "../../../infrastructure/domains/schemas/comments.schema";
import {
  EmailConfirmationTest,
  passwordChangeFeature, passwordChangeTest,
  TokensFeature, TokensTest,
  UserFeature, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { TestingService } from "../application/testing.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";

@Module({
  controllers:[TestingController],
  providers:[TestingService],
  exports:[TestingService],
  imports:[
  TypeOrmModule.forFeature([BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, UsersEntity, PasswordChangeEntity, TokensEntity, CommentsLikesEntity])]
})
export class TestingModule{}
