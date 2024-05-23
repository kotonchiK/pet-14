import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {AnswerDto} from "./models/input";
import {ValidateIdPipe} from "../../../infrastructure/pipes/ValidateIdNumber";
import {QuizService} from "../application/quiz.service";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { Request } from "express";
import { Answers } from "./models/output";
import { OutputGameModel } from "./models/game.output";
@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class Quiz_Controller {
  constructor(private quizService:QuizService) {}

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async connectToGameRoom(@Req() req:Request):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.connection(userId)
  }

  @Post('my-current/answers')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async answerOnQuestion(@Body() body:AnswerDto,
                         @Req() req:Request):Promise<Answers> {

    const userId = req.userId

    return await this.quizService.answerOnQuestion(body.answer, userId)
  }
  @Get('my-current')
  @HttpCode(HttpStatus.OK)
  async getUnfinishedGame(@Req() req:Request):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.getUserUnfinishedGame(userId)
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getGameById(@Req() req:Request,
                        @Param('id', ValidateIdPipe) id:number):Promise<OutputGameModel> {

    const userId = req.userId

    return await this.quizService.getGameById(userId, id)
  }
}