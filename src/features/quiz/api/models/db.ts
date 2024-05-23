import {GameStatus} from "./output";

export type GameDb = {
  startGameDate:Date | null,
  pairCreatedDate:Date,
  finishGameDate:Date | null,
  status:GameStatus,
  player1:PlayerDb
  player2:PlayerDb | null
  answers:[],
  questions:QuestionsDb[],
}


type PlayerDb = {
  id:number
  login:string
  score:number
}

export type AnswersDb = {
  questionId: number;
  answerStatus: string;
  userId: number;
  login: string;
  addedAt: Date
};

export type PlayerDbGame = {
  id: number;
  login: string;
  score: number;
};

export type QuestionsDb = {
  id:number
  body:string
  status1: 0 | 1
  status2: 0 | 1
}
