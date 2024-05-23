import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { TestingService } from "../application/testing.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";
import { GameEntity } from "../../quiz/infrastructure/domains/game.entity";
import { QuestionEntity } from "../../quiz/infrastructure/domains/question.entity";

@Module({
  controllers:[TestingController],
  providers:[TestingService],
  exports:[TestingService],
  imports:[
  TypeOrmModule.forFeature([GameEntity, QuestionEntity, BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, UsersEntity, PasswordChangeEntity, TokensEntity, CommentsLikesEntity])]
})
export class TestingModule{}
