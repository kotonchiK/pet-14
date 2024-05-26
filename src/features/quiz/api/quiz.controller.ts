import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import {AnswerDto} from "./models/input";
import {ValidateIdPipe} from "../../../infrastructure/pipes/ValidateIdNumber";
import {QuizService} from "../application/quiz.service";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { Request } from "express";
import { Answers, Statistic } from "./models/output";
import { OutputGameModel } from "./models/game.output";
import { Pagination } from "../../../base/types/pagination.type";
@Controller('pair-game-quiz')
@UseGuards(JwtAuthGuard)
export class Quiz_Controller {
  constructor(private quizService:QuizService) {}

  @Post('pairs/connection')
  @HttpCode(HttpStatus.OK)
  async connectToGameRoom(@Req() req:Request):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.connection(userId)
  }

  @Post('pairs/my-current/answers')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async answerOnQuestion(@Body() body:AnswerDto,
                         @Req() req:Request):Promise<Answers> {

    const userId = req.userId

    return await this.quizService.answerOnQuestion(body.answer, userId)
  }
  @Get('pairs/my-current')
  @HttpCode(HttpStatus.OK)
  async getUnfinishedGame(@Req() req:Request):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.getUserUnfinishedGame(userId)
  }

  @Get('pairs/my')
  @HttpCode(HttpStatus.OK)
  async getAllUserGames(@Req() req:Request,
                        @Query('sortBy') sortBy:string,
                        @Query('sortDirection') sortDirection:'ASC' | 'DESC',
                        @Query('pageNumber') pageNumber:number,
                        @Query('pageSize') pageSize:number):Promise<Pagination<OutputGameModel>> {

    const sortData = {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize
    }

    const userId = req.userId

    return await this.quizService.getAllUserGames(userId, sortData)
  }

  @Get('pairs/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getGameById(@Req() req:Request,
                        @Param('id', ValidateIdPipe) id:number):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.getGameById(userId, id)
  }


  @Get('users/my-statistic')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getStatisticForUser(@Req() req:Request):Promise<Statistic> {

    const userId = req.userId

    return await this.quizService.getStatisticForUser(userId)
  }
}