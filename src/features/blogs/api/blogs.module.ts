import { Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../infrastructure/blogs.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { BlogFeature, BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import {
  PostFeature,
  PostLikesFeature,
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { PostsService } from "../../posts/application/posts.service";
import { PostsRepository } from "../../posts/infrastructure/posts.repository";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import {
  CommentFeature, CommentsLikes,
  CommentTest
} from "../../../infrastructure/domains/schemas/comments.schema";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { JwtAuthService } from "../../users/application/jwt.service";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { TokensFeature, TokensTest, UserFeature, UserTest } from "../../../infrastructure/domains/schemas/users.schema";
import { SequelizeModule } from "@nestjs/sequelize";
import { BlogsBloggerController } from "./blogs.blogger.controller";
import { BlogsSaController } from "./blogs.sa.controller";
import { BlogsRepository_TYPEORM } from "../infrastructure/typeORM-repositories/blogs.repository";
import { BlogsQueryRepository_TYPEORM } from "../infrastructure/typeORM-repositories/blogs.query.repository";
import { PostsQueryRepository_TYPEORM } from "../../posts/infrastructure/typeORM/posts.query.repository";
import { CommentsQueryRepository_TYPEORM } from "../../comments/infrastructure/typeORM/comments.query.repository";
import { JwtAuthService_TYPEORM } from "../../users/application/typeORM/jwt.service";
import { UsersQueryRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.query.repository";
import { PostsRepository_TYPEORM } from "../../posts/infrastructure/typeORM/posts.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsEntity } from "../infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";

@Module({
  controllers:[BlogsController, BlogsBloggerController, BlogsSaController ],
  providers:[BlogsRepository_TYPEORM, BlogsService, BlogsQueryRepository_TYPEORM, PostsQueryRepository_TYPEORM, PostsService,PostsRepository_TYPEORM, CommentsQueryRepository_TYPEORM, JwtAuthGuard, JwtAuthService_TYPEORM, UsersQueryRepository_TYPEORM],
  exports:[BlogsRepository_TYPEORM, BlogsService, BlogsQueryRepository_TYPEORM, PostsQueryRepository_TYPEORM, PostsService, PostsRepository_TYPEORM, CommentsQueryRepository_TYPEORM],
  imports:[
    TypeOrmModule.forFeature([BlogsEntity, PostsEntity, CommentsEntity, PostsLikesEntity, CommentsLikesEntity, UsersEntity, TokensEntity, PasswordChangeEntity])
  ]
})
export class BlogsModule {}