import { SortDirection } from "mongodb";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto  {
  @IsString({message:'Must be string'})
  @IsEmail({},{message:'Must be email'})
  readonly email:string

  @IsString({message:'Must be string'})
  @Length(3, 10, {message:'falsh lange'})
  readonly login:string

  @IsString({message:'Must be string'})
  @Length(6, 20, {message:'falsh lange'})
  readonly password:string
}

export class UserDb {
  readonly login:string;
  readonly email:string;
  readonly password:string;
  readonly createdAt:Date;
}

export type UsersQueryModel = {
  searchEmailTerm:string
  searchLoginTerm:string
  sortBy?: string
  sortDirection:SortDirection
  pageNumber?:number
  pageSize?:number
}