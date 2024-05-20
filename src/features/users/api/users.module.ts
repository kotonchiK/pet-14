import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { UsersRepository } from "../infrastructure/users.repository";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";
import { UsersQueryRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.query.repository";
import { UsersRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokensEntity, UsersEntity } from "../infrastructure/domains/users.entity";

@Module({
  controllers:[UsersController],
  providers:[UsersService,BasicAuthGuard, UsersQueryRepository_TYPEORM, UsersRepository_TYPEORM],
  exports:[UsersService, UsersQueryRepository_TYPEORM, UsersRepository_TYPEORM],
  imports:[
    TypeOrmModule.forFeature([UsersEntity, TokensEntity])
  ],

})
export class UsersModule {}