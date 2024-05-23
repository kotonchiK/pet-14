import {ForbiddenException, Injectable} from "@nestjs/common";
import {Answers, AnswersForPlayers} from "../api/models/output";
import { GameEntity } from "../infrastructure/domains/game.entity";
import { QuestionsDb } from "../api/models/db";

@Injectable()
export class AnswersService {
  constructor() {}

  async getAnswersForPlayers(game:GameEntity):Promise<AnswersForPlayers> {
    const filteredAnswers1 = game.answers.filter(answer => Number(answer.userId) === game.player1.id);
    const filteredAnswers2 = game.answers.filter(answer => Number(answer.userId) === game.player2.id);

    const answersForFirstPlayer:Answers[] = filteredAnswers1.map(answer => ({
      questionId: answer.questionId.toString(),
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt
    }));

    const answersForSecondPlayer:Answers[] = filteredAnswers2.map(answer => ({
      questionId: answer.questionId.toString(),
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt
    }));

    return {answersForFirstPlayer, answersForSecondPlayer}
  }

  private async getQuestion(questions:QuestionsDb[], statusField: 'status1' | 'status2'):Promise<number> {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i][statusField] === 0) {
        questions[i][statusField] = 1;
        return questions[i].id;
      }
    }
    throw new ForbiddenException();
  }

  async getQuestionForFirst(questions:QuestionsDb[]):Promise<number> {
    return this.getQuestion(questions, 'status1');
  }

  async getQuestionForSecond(questions:QuestionsDb[]):Promise<number> {
    return this.getQuestion(questions, 'status2');
  }


  wasTheLastAnswer(questions:QuestionsDb[]):boolean {
    return questions.every(question => question.status1 === 1 && question.status2 === 1)
  }
}
