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

@Module({
  controllers:[TestingController],
  providers:[TestingService],
  exports:[TestingService],
  imports:[
    MongooseModule.forFeature([
    BlogFeature, PostFeature, PostLikesFeature, CommentFeature, UserFeature, passwordChangeFeature, TokensFeature
  ]),
  SequelizeModule.forFeature([
    BlogTest, PostTest, PostLikesTest, CommentTest, UserTest, passwordChangeTest, TokensTest, EmailConfirmationTest
  ])]
})
export class TestingModule{}
