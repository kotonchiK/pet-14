import { IsString, IsIn } from 'class-validator';

export class LikeStatusDto {
  @IsString({ message: 'Must be a string' })
  @IsIn(['None', 'Like', 'Dislike'], { message: 'Must be "None", "Like", or "Dislike"' })
  likeStatus: 'None' | 'Like' | 'Dislike';
}


export type statusType = {
  id:number
  status:"None" | "Dislike" | "Like"
  userId:number
}

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None'
}