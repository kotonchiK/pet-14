import { SortDirection } from "mongodb";
import { IsString, IsUrl, Length } from "class-validator";
import { IsTrim } from "../../../../infrastructure/decorators/isTrim";

export class CreateBlogDto  {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(1, 15, {message:'falsh lange'})
  readonly name:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(1, 500, {message:'falsh lange'})
  readonly description:string

  @IsTrim({message:'trim'})
  @IsUrl({}, {message:'Must be Url'})
  @Length(1, 100, {message:'falsh lange'})
  readonly websiteUrl:string
}

export class CreatePostBlogDto  {
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
}

export class BlogDb {
  readonly name:string;
  readonly description:string;
  readonly websiteUrl:string;
  readonly createdAt:Date;
  readonly isMembership:boolean

}

export type BlogQueryModel = {
  searchNameTerm?:string
  sortBy?: string
  sortDirection?:SortDirection
  pageNumber?:number
  pageSize?:number
}