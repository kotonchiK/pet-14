import { Module } from "@nestjs/common";
import { Quiz_Controller } from "./quiz.controller";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";
import { TypeOrmModule } from "@nestjs/typeorm";
import {QuizService} from "../application/quiz.service";
import {QuestionsRepository} from "../infrastructure/typeORM-repositories/questions.repository";
import {TokensEntity, UsersEntity} from "../../users/infrastructure/domains/users.entity";
import { JwtAuthService_TYPEORM } from "../../users/application/typeORM/jwt.service";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { UsersQueryRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.query.repository";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { Questions_Controller } from "./questions.controller";
import { QuestionsQueryRepository } from "../infrastructure/typeORM-repositories/quiz.query.repository";
import { QuestionsService } from "../application/questions.service";
import { QuizRepository } from "../infrastructure/typeORM-repositories/quiz.repository";
import { GameService } from "../application/game.service";
import { AnswersService } from "../application/answers.service";
import { GameEntity, StatisticEntity } from "../infrastructure/domains/game.entity";
import { QuestionEntity } from "../infrastructure/domains/question.entity";

@Module({
  controllers:[Quiz_Controller, Questions_Controller],
  providers:[AnswersService, GameService, QuizRepository, QuestionsService, QuizService, BasicAuthGuard, QuestionsQueryRepository, QuestionsRepository, JwtAuthService_TYPEORM, JwtAuthGuard, UsersQueryRepository_TYPEORM, UsersRepository_TYPEORM
  ],
  exports:[],
  imports:[
    TypeOrmModule.forFeature([StatisticEntity, QuestionEntity, GameEntity, UsersEntity, TokensEntity])
  ],

})
export class QuizModule {}