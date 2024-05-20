import { Module, RequestMethod } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { UsersRepository } from "../infrastructure/users.repository";
import { AuthService } from "../application/auth.service";
import { JwtAuthService } from "../application/jwt.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { RefreshTokenMiddleware } from "../../../infrastructure/middlewares/refToken.mdw";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { JwtService } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthThrottlerSettings } from "../../../app.settings";
import { UsersQueryRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.query.repository";
import { UsersRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.repository";
import { JwtAuthService_TYPEORM } from "../application/typeORM/jwt.service";
import { AuthService_TYPEORM } from "../application/typeORM/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../infrastructure/domains/users.entity";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";

@Module({
  controllers:[AuthController],
  providers:[
    UsersService,
    JwtAuthGuard, JwtService, EmailManager,EmailAdapter, RefreshTokenMiddleware,
    UsersQueryRepository_TYPEORM, UsersRepository_TYPEORM, JwtAuthService_TYPEORM, AuthService_TYPEORM
  ],
  exports:[EmailManager,EmailAdapter, UsersQueryRepository_TYPEORM,
    UsersRepository_TYPEORM, JwtAuthService_TYPEORM, AuthService_TYPEORM],
  imports:[
  // ThrottlerModule.forRoot(AuthThrottlerSettings),
    TypeOrmModule.forFeature([BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, UsersEntity, PasswordChangeEntity, TokensEntity, CommentsLikesEntity])
  ]
})
export class AuthModule {
  configure(consumer) {
    consumer
      .apply(RefreshTokenMiddleware)
      .forRoutes(
        { path: 'auth/refresh-token', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST })
  }
}