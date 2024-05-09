import { Module, RequestMethod } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
  EmailConfirmationTest,
  passwordChangeFeature, passwordChangeTest,
  TokensFeature, TokensTest,
  UserFeature, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { UsersRepository } from "../infrastructure/users.repository";
import { AuthService } from "../application/auth.service";
import { JwtAuthService } from "../application/jwt.service";
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { EmailAdapter } from "../../../infrastructure/email/email.adapter";
import { RefreshTokenMiddleware } from "../../../infrastructure/middlewares/refToken.mdw";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { JwtService } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthThrottlerSettings } from "../../../app.settings";

@Module({
  controllers:[AuthController],
  providers:[
    UsersRepository, UsersService, UsersQueryRepository, AuthService,
    JwtAuthService, JwtAuthGuard, JwtService, EmailManager,EmailAdapter, RefreshTokenMiddleware
  ],
  exports:[UsersRepository, UsersService, UsersQueryRepository, AuthService, JwtAuthService, EmailManager,EmailAdapter],
  imports:[
    ThrottlerModule.forRoot(AuthThrottlerSettings),
    MongooseModule.forFeature([
    UserFeature, TokensFeature, passwordChangeFeature
  ]),
  SequelizeModule.forFeature([
    UserTest, passwordChangeTest, EmailConfirmationTest, TokensTest
  ])]
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