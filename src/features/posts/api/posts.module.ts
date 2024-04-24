import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../infrastructure/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsRepository } from "../infrastructure/posts.repository";
import {
  PostFeature,
  PostLikesFeature,
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { BlogsQueryRepository } from "../../blogs/infrastructure/blogs.query.repository";
import { BlogFeature, BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { CommentFeature, CommentTest } from "../../../infrastructure/domains/schemas/comments.schema";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { JwtAuthService } from "../../users/application/jwt.service";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import {
  EmailConfirmationTest,
  passwordChangeFeature, passwordChangeTest,
  TokensFeature, TokensTest,
  UserFeature, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { CommentsService } from "../../comments/application/comments.service";
import { CommentsRepository } from "../../comments/infrastructure/comments.repository";
import { AuthService } from "../../users/application/auth.service";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { UsersService } from "../../users/application/users.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { IsBlogExist } from "../../../infrastructure/decorators/isBlogExist";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  controllers:[PostsController],
  providers:[PostsRepository, PostsService, PostsQueryRepository, BlogsQueryRepository,
    CommentsQueryRepository, JwtAuthGuard, JwtAuthService, UsersQueryRepository,
  CommentsService, CommentsRepository, AuthService, UsersRepository, UsersService, EmailManager, EmailAdapter, IsBlogExist],
  imports:[MongooseModule.forFeature([
    PostFeature, PostLikesFeature, BlogFeature, CommentFeature, UserFeature, TokensFeature, passwordChangeFeature
  ]),
    SequelizeModule.forFeature([
      BlogTest, PostTest, PostLikesTest, CommentTest, UserTest, TokensTest, passwordChangeTest, EmailConfirmationTest
    ])]
})
export class PostsModule {}