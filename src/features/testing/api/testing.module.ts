import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogFeature } from "../../../infrastructure/domains/schemas/blogs.schema";
import { PostFeature, PostLikesFeature } from "../../../infrastructure/domains/schemas/posts.schema";
import { CommentFeature } from "../../../infrastructure/domains/schemas/comments.schema";
import { UserFeature } from "../../../infrastructure/domains/schemas/users.schema";
import { TestingService } from "../application/testing.service";

@Module({
  controllers:[TestingController],
  providers:[TestingService],
  exports:[TestingService],
  imports:[
    MongooseModule.forFeature([
    BlogFeature, PostFeature, PostLikesFeature, CommentFeature, UserFeature
  ])]
})
export class TestingModule{}
