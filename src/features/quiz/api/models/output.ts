export type OutputQuestionsModel = {
  id:string
  body:string
}

export type Answers = {
  questionId:string
  answerStatus:string
  addedAt:Date
}

export type OutputQuestionModel = {
  id: string
  body: string
  correctAnswers: string[]
  published: boolean,
  createdAt: Date
  updatedAt: Date | null
}

export type AnswersForPlayers = {
  answersForFirstPlayer:Answers[],
  answersForSecondPlayer:Answers[]
}

export enum GameStatus {
  PendingSecondPlayer = "PendingSecondPlayer",
  Active = "Active",
  Finished = "Finished"
}