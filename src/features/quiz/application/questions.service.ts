import { BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {CreateQuestionDto, PublishStatusDto, QuestionDb, UpdateQuestionType} from "../api/models/input";
import {QuestionsRepository} from "../infrastructure/typeORM-repositories/questions.repository";
import {questionMapper} from "./quiz.mapper";
import { OutputQuestionModel } from "../api/models/output";
import { QuestionEntity } from "../infrastructure/domains/question.entity";

@Injectable()
export class QuestionsService {
  constructor(private quizRepository:QuestionsRepository) {}
  async getQuestionEntity(questionId:number):Promise<QuestionEntity | null> {
    const questionEntity = await this.quizRepository.getQuestionEntity(questionId)

    if(!questionEntity) throw new BadRequestException('Question is not publish or some problem wit question')

    return questionEntity
  }
  async createQuestion(dto:CreateQuestionDto):Promise<OutputQuestionModel> {

    const newQuestion:QuestionDb = {
      body:dto.body,
      correctAnswers:dto.correctAnswers,
      published:false,
      createdAt:new Date(),
      updatedAt:null
    }

    const createdQuestion = await this.quizRepository.createQuestion(newQuestion)

    return questionMapper(createdQuestion)
  }

  async updateQuestion(dto:CreateQuestionDto, questionId:number):Promise<void> {
    const question = await this.quizRepository.isQuestion(questionId)

    if(!question) throw new NotFoundException()

    const updateInfo:UpdateQuestionType = {
      id:questionId,
      body:dto.body,
      correctAnswers:dto.correctAnswers,
      updatedAt:new Date()
    }

    return await this.quizRepository.updateQuestion(updateInfo)
  }

  async deleteQuestion(questionId:number):Promise<void> {
    const question = await this.quizRepository.isQuestion(questionId)

    if(!question) throw new NotFoundException()

    return await this.quizRepository.deleteQuestion(questionId)
  }

  async publishQuestion(dto:PublishStatusDto, questionId:number):Promise<void> {

    const question = await this.quizRepository.getQuestionEntity(questionId)

    if(!question) throw new NotFoundException()

    if(question.correctAnswers.length < 0) throw new BadRequestException()

    if(question.published === dto.published) return

    return await this.quizRepository.publishQuestion(dto, questionId)
  }
}