import { IsString, IsIn } from 'class-validator';

export class LikeStatusDto {
  @IsString({ message: 'Must be a string' })
  @IsIn(['None', 'Like', 'Dislike'], { message: 'Must be "None", "Like", or "Dislike"' })
  likeStatus: 'None' | 'Like' | 'Dislike';
}


export type statusType = {
  id:string
  status:"None" | "Dislike" | "Like"
  userId:string
}