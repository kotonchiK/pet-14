import {ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsString, Length} from "class-validator";
import { IsTrim } from "../../../../infrastructure/decorators/isTrim";

export class CreateQuestionDto {
  @IsTrim({ message: 'trim' })
  @IsString({ message: 'Must be string' })
  @Length(10, 500, { message: 'false length' })
  readonly body: string;

  @IsArray({ message: 'Must be an array' })
  @ArrayNotEmpty({ message: 'Array should not be empty' })
  @ArrayMinSize(1, { message: 'Array should have at least one item' })
  @IsString({ each: true, message: 'Each correct answer must be a string' })
  readonly correctAnswers: string[];
}

export class AnswerDto {
  @IsTrim({ message: 'trim' })
  @IsString({ message: 'Must be string' })
  readonly answer:string;
}

export class PublishStatusDto {
  @IsBoolean({message:'must be boolean'})
  readonly published:boolean
}

export class QuestionDb {
  readonly body:string
  readonly correctAnswers:string[]
  readonly published:boolean
  readonly createdAt:Date
  readonly updatedAt:Date | null
}

export type UpdateQuestionType = {
  readonly id:number
  readonly body:string
  readonly correctAnswers:string[]
  readonly updatedAt:Date
}

export type QuestionsQueryModel = {
  bodySearchTerm?:string
  publishedStatus?:'all' | 'published' | 'notPublished'
  sortBy?: string
  sortDirection?:'ASC' | 'DESC'
  pageNumber?:number
  pageSize?:number
}

export type GamesQueryModel = {
  sortBy?: string
  sortDirection?:'ASC' | 'DESC'
  pageNumber?:number
  pageSize?:number
}