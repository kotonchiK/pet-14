import { Module, RequestMethod } from "@nestjs/common";
import { DevicesController } from "./devices.controller";
import { DevicesService } from "../application/devices.service";
import { DevicesQueryRepository } from "../infrastructure/devices.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
  passwordChangeFeature,
  TokensFeature,
  UserFeature
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

@Module({
  controllers: [DevicesController],
  exports: [DevicesRepository, DevicesService, DevicesQueryRepository],
  imports: [MongooseModule.forFeature([
    UserFeature, TokensFeature, passwordChangeFeature
  ])],
  providers: [
    JwtAuthService, EmailAdapter,
    DevicesRepository, DevicesService, DevicesQueryRepository, AuthService, UsersRepository, UsersQueryRepository, UsersService, EmailManager]
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