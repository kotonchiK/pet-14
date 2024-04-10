import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { TokensFeature, UserFeature } from "../../../infrastructure/domains/schemas/users.schema";
import { UsersRepository } from "../infrastructure/users.repository";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";

@Module({
  controllers:[UsersController],
  providers:[UsersRepository, UsersService, UsersQueryRepository, BasicAuthGuard],
  exports:[UsersRepository, UsersService, UsersQueryRepository],
  imports:[MongooseModule.forFeature([
    UserFeature, TokensFeature
  ])]
})
export class UsersModule {}