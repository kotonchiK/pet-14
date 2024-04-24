import { IsString, Length } from "class-validator";
import { IsTrim } from "../../../../infrastructure/decorators/isTrim";

export class CreateCommentDto  {
  @IsTrim({message:'trim'})
  @IsString({message:'Must be string'})
  @Length(20, 300, {message:'falsh lange'})
  readonly content:string
}
