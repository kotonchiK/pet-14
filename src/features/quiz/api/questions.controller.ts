import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import {CreateQuestionDto, PublishStatusDto} from "./models/input";
import {OutputQuestionModel} from "./models/output";
import {Pagination} from "../../../base/types/pagination.type";
import {BasicAuthGuard} from "../../../infrastructure/guards/auth.basic";
import {ValidateIdPipe} from "../../../infrastructure/pipes/ValidateIdNumber";
import {
  QuestionsQueryRepository,
} from "../infrastructure/typeORM-repositories/quiz.query.repository";
import { QuestionsService } from "../application/questions.service";
@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class Questions_Controller {
  constructor(private questionsService:QuestionsService,
              private questionsQueryRepository: QuestionsQueryRepository) {}
  @Get()
  async getQuestions(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:'ASC' | 'DESC',
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    @Query('publishedStatus') publishedStatus:'all' | 'published' | 'notPublished',
    @Query('bodySearchTerm') bodySearchTerm:string,
    ):Promise<Pagination<OutputQuestionModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize,
      publishedStatus:publishedStatus,
      bodySearchTerm:bodySearchTerm
    }

    return await this.questionsQueryRepository.getQuestions(query)
  }
  @Post()
  @UsePipes(ValidationPipe)
  async createQuestion(@Body() body:CreateQuestionDto):Promise<OutputQuestionModel> {

    return await this.questionsService.createQuestion(body)
  }
  @Put(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(@Body() body:CreateQuestionDto,
                       @Param('id', ValidateIdPipe) id:number):Promise<void> {

    return await this.questionsService.updateQuestion(body, id)
  }
  @Put(':id/publish')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(@Body() body:PublishStatusDto,
                        @Param('id', ValidateIdPipe) id:number):Promise<void> {

    return await this.questionsService.publishQuestion(body, id)
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id', ValidateIdPipe) id:number):Promise<void> {

    return await this.questionsService.deleteQuestion(id)
  }
}