import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../infrastructure/comments.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { CommentFeature } from "../../../infrastructure/domains/schemas/comments.schema";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { PostFeature, PostLikesFeature } from "../../../infrastructure/domains/schemas/posts.schema";
import {
  passwordChangeFeature,
  TokensFeature,
  UserFeature
} from "../../../infrastructure/domains/schemas/users.schema";
import { JwtAuthService } from "../../users/application/jwt.service";
import { AuthService } from "../../users/application/auth.service";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { UsersService } from "../../users/application/users.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { CurrentUserIdPipe } from "../../../infrastructure/pipes/currentUserId.pipe";

@Module({
  controllers:[CommentsController],
  providers:[CommentsRepository, CommentsService, CommentsQueryRepository,
    PostsQueryRepository, UsersQueryRepository, JwtAuthService, AuthService, UsersRepository,
    UsersService, EmailManager, EmailAdapter, CurrentUserIdPipe],
  exports:[CommentsRepository, CommentsService, CommentsQueryRepository],
  imports:[MongooseModule.forFeature([
    CommentFeature, PostFeature, PostLikesFeature, UserFeature, TokensFeature, passwordChangeFeature
  ])]
})
export class CommentsModule {}