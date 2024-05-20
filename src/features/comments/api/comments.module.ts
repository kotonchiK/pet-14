import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsRepository } from "../infrastructure/comments.repository";
import {
  CommentFeature, CommentsLikes,
  CommentTest
} from "../../../infrastructure/domains/schemas/comments.schema";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import {
  PostFeature,
  PostLikesFeature,
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import {
  EmailConfirmationTest,
  passwordChangeFeature, passwordChangeTest,
  TokensFeature, TokensTest,
  UserFeature, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { JwtAuthService } from "../../users/application/jwt.service";
import { AuthService } from "../../users/application/auth.service";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { UsersService } from "../../users/application/users.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { CurrentUserIdPipe } from "../../../infrastructure/pipes/currentUserId.pipe";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { CommentsRepository_TYPEORM } from "../infrastructure/typeORM/comments.repository";
import { CommentsQueryRepository_TYPEORM } from "../infrastructure/typeORM/comments.query.repository";
import { PostsQueryRepository_TYPEORM } from "../../posts/infrastructure/typeORM/posts.query.repository";
import { UsersQueryRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.query.repository";
import { JwtAuthService_TYPEORM } from "../../users/application/typeORM/jwt.service";
import { AuthService_TYPEORM } from "../../users/application/typeORM/auth.service";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsEntity, CommentsLikesEntity } from "../infrastructure/domains/comments.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";

@Module({
  controllers:[CommentsController],
  providers:[CommentsRepository_TYPEORM, CommentsService, CommentsQueryRepository_TYPEORM,
    PostsQueryRepository_TYPEORM, UsersQueryRepository_TYPEORM, JwtAuthService_TYPEORM, AuthService_TYPEORM, UsersRepository_TYPEORM,
    UsersService, EmailManager, EmailAdapter, CurrentUserIdPipe, JwtAuthGuard],
  exports:[CommentsRepository_TYPEORM, CommentsService, CommentsQueryRepository_TYPEORM],
  imports:[
    TypeOrmModule.forFeature([BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, UsersEntity, PasswordChangeEntity, TokensEntity, CommentsLikesEntity])
  ]
})
export class CommentsModule {}