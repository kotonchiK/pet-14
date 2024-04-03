import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserFeature } from "../../../infrastructure/domains/schemas/users.schema";
import { UsersRepository } from "../infrastructure/users.repository";

@Module({
  controllers:[UsersController],
  providers:[UsersRepository, UsersService, UsersQueryRepository],
  exports:[UsersRepository, UsersService, UsersQueryRepository],
  imports:[MongooseModule.forFeature([
    UserFeature
  ])]
})
export class UsersModule {}