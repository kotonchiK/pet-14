import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../infrastructure/posts.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsRepository } from "../infrastructure/posts.repository";
import { PostFeature, PostLikesFeature } from "../../../infrastructure/domains/schemas/posts.schema";
import { BlogsQueryRepository } from "../../blogs/infrastructure/blogs.query.repository";
import { BlogFeature } from "../../../infrastructure/domains/schemas/blogs.schema";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { CommentFeature } from "../../../infrastructure/domains/schemas/comments.schema";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { JwtAuthService } from "../../users/application/jwt.service";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { TokensFeature, UserFeature } from "../../../infrastructure/domains/schemas/users.schema";

@Module({
  controllers:[PostsController],
  providers:[PostsRepository, PostsService, PostsQueryRepository, BlogsQueryRepository, CommentsQueryRepository, JwtAuthGuard, JwtAuthService, UsersQueryRepository],
  imports:[MongooseModule.forFeature([
    PostFeature, PostLikesFeature, BlogFeature, CommentFeature, UserFeature, TokensFeature
  ])]
})
export class PostsModule {}