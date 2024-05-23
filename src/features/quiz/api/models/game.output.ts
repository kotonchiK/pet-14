import { Answers, OutputQuestionsModel } from "./output";

export type OutputGameModel = {
  id:string,
  firstPlayerProgress:PlayerProgress
  secondPlayerProgress:PlayerProgress | null
  questions:OutputQuestionsModel[] | null
  finishGameDate:Date | null
  startGameDate:Date | null
  pairCreatedDate:Date
  status:string
}

type PlayerProgress = {
  answers:Answers[]
  player:OutputPlayerModel
  score:number
}

type OutputPlayerModel = {
  id:string
  login:string
}