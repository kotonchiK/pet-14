import { SortDirection } from "mongodb";
import { IsString, Length } from "class-validator";

export class CreatePostDto  {
  @IsString({message:'Must be string'})
  @Length(1, 30, {message:'falsh lange'})
  readonly title:string

  @IsString({message:'Must be string'})
  @Length(1, 100, {message:'falsh lange'})
  readonly shortDescription:string

  @IsString({message:'Must be string'})
  @Length(1, 1000, {message:'falsh lange'})
  readonly content:string

  @IsString({message:'Must be string'})
  readonly blogId:string
}

export class PostDb {
  readonly title:string;
  readonly shortDescription:string;
  readonly content:string;
  readonly createdAt:Date;
  readonly blogId:string
  readonly blogName:string

}

export type PostQueryModel = {
  sortBy?: string
  sortDirection?:SortDirection
  pageNumber?:number
  pageSize?:number
}