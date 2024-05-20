import { Module, RequestMethod } from "@nestjs/common";
import { DevicesController } from "./devices.controller";
import { DevicesService } from "../application/devices.service";
import { DevicesQueryRepository } from "../infrastructure/devices.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
  EmailConfirmationTest,
  passwordChangeFeature, passwordChangeTest,
  TokensFeature, TokensTest,
  UserFeature, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { DevicesRepository } from "../infrastructure/devices.repository";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";
import { AuthService } from "../../users/application/auth.service";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { UsersQueryRepository } from "../../users/infrastructure/users.query.repository";
import { UsersService } from "../../users/application/users.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { JwtAuthService } from "../../users/application/jwt.service";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { RefreshTokenMiddleware } from "../../../infrastructure/middlewares/refToken.mdw";
import { SequelizeModule } from "@nestjs/sequelize";
import { DevicesRepository_TYPEORM } from "../infrastructure/typeORM/devices.repository";
import { DevicesQueryRepository_TYPEORM } from "../infrastructure/typeORM/devices.query.repository";
import { JwtAuthService_TYPEORM } from "../../users/application/typeORM/jwt.service";
import { AuthService_TYPEORM } from "../../users/application/typeORM/auth.service";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { UsersQueryRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "../../comments/infrastructure/domains/comments.entity";

@Module({
  controllers: [DevicesController],
  exports: [DevicesRepository_TYPEORM, DevicesService, DevicesQueryRepository_TYPEORM],
  imports: [
    TypeOrmModule.forFeature([BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, UsersEntity, PasswordChangeEntity, TokensEntity, CommentsLikesEntity])
  ],
  providers: [
    JwtAuthService_TYPEORM, EmailAdapter,
    DevicesRepository_TYPEORM, DevicesService, DevicesQueryRepository_TYPEORM, AuthService_TYPEORM, UsersRepository_TYPEORM, UsersQueryRepository_TYPEORM, UsersService, EmailManager]
})
export class DevicesModule {
  configure(consumer) {
    consumer
      .apply(RefreshTokenMiddleware)
      .forRoutes(
        { path: '/security/devices', method: RequestMethod.ALL },
        { path: '/security/devices/:id', method: RequestMethod.DELETE })
}
}