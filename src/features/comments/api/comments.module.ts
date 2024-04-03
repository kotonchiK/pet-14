import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { CommentFeature } from "../../../infrastructure/domains/schemas/comments.schema";

@Module({
  controllers:[CommentsController],
  providers:[CommentsRepository, CommentsService, CommentsQueryRepository],
  exports:[CommentsRepository, CommentsService, CommentsQueryRepository],
  imports:[MongooseModule.forFeature([
    CommentFeature
  ])]
})
export class CommentsModule {}