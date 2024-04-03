import { Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../infrastructure/blogs.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { BlogFeature } from "../../../infrastructure/domains/schemas/blogs.schema";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { PostFeature, PostLikesFeature } from "../../../infrastructure/domains/schemas/posts.schema";
import { PostsService } from "../../posts/application/posts.service";
import { PostsRepository } from "../../posts/infrastructure/posts.repository";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { CommentFeature } from "../../../infrastructure/domains/schemas/comments.schema";

@Module({
  controllers:[BlogsController],
  providers:[BlogsRepository, BlogsService, BlogsQueryRepository, PostsQueryRepository, PostsService, PostsRepository, CommentsQueryRepository],
  exports:[BlogsRepository, BlogsService, BlogsQueryRepository, PostsQueryRepository, PostsService, PostsRepository, CommentsQueryRepository],
  imports:[MongooseModule.forFeature([
    BlogFeature, PostFeature, PostLikesFeature, CommentFeature
  ])]
})
export class BlogsModule {}