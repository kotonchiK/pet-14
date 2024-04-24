import { SortDirection } from "mongodb";
import { IsEmail, IsString, Length } from "class-validator";
import { IsTrim } from "../../../../infrastructure/decorators/isTrim";

export class CreateUserDto  {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @IsEmail({},{message:'Must be email'})
  readonly email:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(3, 10, {message:'falsh lange'})
  readonly login:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(6, 20, {message:'falsh lange'})
  readonly password:string
}



export class NewPasswordDto {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(6, 20, {message:'Length is false'})
  readonly newPassword:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  readonly recoveryCode:string
}

export class MailDto {
  @IsEmail()
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  readonly email:string
}
export class CodeDto {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  readonly code:string
}


export class loginUserDto {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  readonly loginOrEmail:string

  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  readonly password:string
}

export type DeleteDeviceModel = {
  id:string
  requestId:string
  userId:string
}