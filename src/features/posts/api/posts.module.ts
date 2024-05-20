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
import {
  CommentFeature, CommentsLikes,
  CommentTest
} from "../../../infrastructure/domains/schemas/comments.schema";
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
import { PostsRepository_TYPEORM } from "../infrastructure/typeORM/posts.repository";
import { PostsQueryRepository_TYPEORM } from "../infrastructure/typeORM/posts.query.repository";
import { BlogsQueryRepository_TYPEORM } from "../../blogs/infrastructure/typeORM-repositories/blogs.query.repository";
import { CommentsQueryRepository_TYPEORM } from "../../comments/infrastructure/typeORM/comments.query.repository";
import { JwtAuthService_TYPEORM } from "../../users/application/typeORM/jwt.service";
import { UsersQueryRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.query.repository";
import { AuthService_TYPEORM } from "../../users/application/typeORM/auth.service";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsEntity, PostsLikesEntity } from "../infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { CommentsRepository_TYPEORM } from "../../comments/infrastructure/typeORM/comments.repository";

@Module({
  controllers:[PostsController],
  providers:[PostsRepository_TYPEORM, PostsService, PostsQueryRepository_TYPEORM, BlogsQueryRepository_TYPEORM,
    JwtAuthGuard, JwtAuthService_TYPEORM, UsersQueryRepository_TYPEORM, CommentsRepository_TYPEORM,
  CommentsService, CommentsQueryRepository_TYPEORM, AuthService_TYPEORM, UsersRepository_TYPEORM, UsersService, EmailManager, EmailAdapter, IsBlogExist],
  imports:[
    TypeOrmModule.forFeature([PostsEntity, PostsLikesEntity, CommentsLikesEntity, CommentsEntity, UsersEntity, TokensEntity, BlogsEntity, PasswordChangeEntity])
  ]
})
export class PostsModule {}