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



export class NewPasswordDto {
  @IsString({message:'Must be string'})
  @Length(6, 20, {message:'Length is false'})
  readonly newPassword:string

  @IsString({message:'Must be string'})
  readonly recoveryCode:string
}

export class MailDto {
  @IsEmail()
  @IsString({message:'Must be string'})
  readonly email:string
}
export class CodeDto {
  @IsString({message:'Must be string'})
  readonly code:string
}


export class loginUserDto {
  @IsString({message:'Must be string'})
  readonly loginOrEmail:string

  @IsString({message:'Must be string'})
  readonly password:string
}

export class UserDb {
  readonly login:string;
  readonly email:string;
  readonly password:string;
  readonly createdAt:Date;
  readonly emailConfirmation:emailConfirmation
}

type emailConfirmation = {
  confirmationCode:string
  expirationDate:Date
  isConfirmed:boolean
}

export type UsersQueryModel = {
  searchEmailTerm:string
  searchLoginTerm:string
  sortBy?: string
  sortDirection:SortDirection
  pageNumber?:number
  pageSize?:number
}