import { SortDirection } from "mongodb";
import { IsString, Length, Validate } from "class-validator";
import { IsTrim } from "../../../../infrastructure/decorators/isTrim";
import { IsBlogExist } from "../../../../infrastructure/decorators/isBlogExist";
import { IsNumeric } from "sequelize-typescript";

export class CreatePostDto  {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(1, 30, {message:'falsh lange'})
  readonly title:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(1, 100, {message:'falsh lange'})
  readonly shortDescription:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(1, 1000, {message:'falsh lange'})
  readonly content:string

  @IsTrim({message:'trim'})
  @Validate(IsBlogExist)
  readonly blogId:number
}

export class PostDb {
  readonly title:string;
  readonly shortDescription:string;
  readonly content:string;
  readonly createdAt:Date;
  readonly blogId:number
  readonly blogName:string
}

export type PostQueryModel = {
  sortBy?: string
  sortDirection?:'ASC' | 'DESC'
  pageNumber?:number
  pageSize?:number
}