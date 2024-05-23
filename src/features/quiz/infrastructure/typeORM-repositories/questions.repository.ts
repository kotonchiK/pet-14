import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {PublishStatusDto, QuestionDb, UpdateQuestionType} from "../../api/models/input";
import { QuestionEntity } from "../domains/question.entity";
import { QuestionsDb } from "../../api/models/db";
export class QuestionsRepository {
  constructor(@InjectRepository(QuestionEntity) private questionsOrmRepository:Repository<QuestionEntity>){}
  async isQuestion(questionId:number):Promise<boolean> {
    try {
      const question = await this.questionsOrmRepository.count({where:{id:questionId}})
      return !!question;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
  async createQuestion(newQuestion:QuestionDb):Promise<QuestionEntity> {
    try {
      const question = await this.questionsOrmRepository.save(newQuestion)

      if(!question) return null

      return question
    } catch (error) {
      console.log('Create-question error => ', error);
      throw new BadRequestException();
    }
  }

  async updateQuestion(updateInfo:UpdateQuestionType):Promise<void> {
    try {
      const question = await this.questionsOrmRepository.findOne({where:{id:updateInfo.id}})

      question.body = updateInfo.body
      question.correctAnswers = updateInfo.correctAnswers
      question.updatedAt = updateInfo.updatedAt

      await this.questionsOrmRepository.save(question)
    } catch (error) {
      console.log('Update-question error => ', error);
      throw new BadRequestException();
    }
  }
  async publishQuestion(dto:PublishStatusDto, questionId:number):Promise<void> {
    try {
      const question = await this.questionsOrmRepository.findOne({ where:{id:questionId} })
      question.published = dto.published
      question.updatedAt = new Date()
      await this.questionsOrmRepository.save(question)
    } catch (e) {
      console.log('Publish-question error => ', e)
      throw new BadRequestException()
    }
  }
  async deleteQuestion(questionId:number):Promise<void> {
    try {
      const question = await this.questionsOrmRepository.findOne({ where:{id:questionId} })
      await this.questionsOrmRepository.remove(question)
    } catch (e) {
      console.log('Delete-User error => ', e)
      throw new NotFoundException()
    }
  }
  async getQuestionEntity(questionId:number):Promise<QuestionEntity | null> {
    try {
      return await this.questionsOrmRepository.findOne({where:{id:questionId}})
    } catch (e) {
      return null
    }
  }

  async createQuestionsList():Promise<QuestionsDb[] | null[]>{
    const questions = await this.questionsOrmRepository.find()

    const questionsList:QuestionsDb[] = []

    if(questions.length !== 0) {
      for(let i = 0; i < 5; i++) {
        if(questions[i] !== null && questions[i].published === true) questionsList.push({id:questions[i].id,body:questions[i].body, status1:0, status2:0})
      }
    } else throw new BadRequestException()

    return questionsList
  }

}