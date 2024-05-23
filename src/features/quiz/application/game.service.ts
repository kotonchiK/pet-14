import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException,} from "@nestjs/common";
import {QuestionsRepository} from "../infrastructure/typeORM-repositories/questions.repository";
import {InjectRepository} from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Answers, GameStatus } from "../api/models/output";
import { QuizRepository } from "../infrastructure/typeORM-repositories/quiz.repository";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { GameEntity } from "../infrastructure/domains/game.entity";
import { OutputGameModel } from "../api/models/game.output";
import { GameDb } from "../api/models/db";

@Injectable()
export class GameService {
  constructor(private questionsRepository:QuestionsRepository,
              private quizRepository:QuizRepository,
              private userRepository:UsersRepository_TYPEORM,
              @InjectRepository(GameEntity) private gameOrmRepository:Repository<GameEntity>) {}

  async getGameById(gameId:number):Promise<GameEntity>{

    const game = await this.gameOrmRepository.findOne({where:{id:gameId}})

    if(!game) throw new NotFoundException()

    return game
  }
  async saveGame(game:GameEntity):Promise<void>{
    try {
      await this.gameOrmRepository.save(game)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async finishTheGame(game:GameEntity, answersForFirstPlayer:Answers[], answersForSecondPlayer:Answers[]): Promise<GameEntity> {
    game.status = GameStatus.Finished;
    game.finishGameDate = new Date();

    function findLatestAnswer(answers:Answers[]): Answers | null {
      if (answers.length === 0) {
        return null; // Возвращаем null, если массив пуст
      }

      return answers.reduce((latest, current) => {
        return current.addedAt > latest.addedAt ? current : latest;
      });
    }

    const lastAnswer1 = findLatestAnswer(answersForFirstPlayer);
    const lastAnswer2 = findLatestAnswer(answersForSecondPlayer);

    if (!lastAnswer1 || !lastAnswer2) {
      throw new Error("Both players must have at least one answer.");
    }

    if (lastAnswer1.addedAt < lastAnswer2.addedAt && game.player1.score > 0) {
      game.player1.score += 1;
    }

    if (lastAnswer2.addedAt < lastAnswer1.addedAt && game.player2.score > 0) {
      game.player2.score += 1;
    }

    return game;
  }



  async createNewGame(userId:number):Promise<OutputGameModel>{

    const user = await this.userRepository.getUserEntity(userId)

    const questionsList = await this.questionsRepository.createQuestionsList()

    const newGame:GameDb = {
      startGameDate:null,
      pairCreatedDate:new Date(),
      finishGameDate:null,
      status:GameStatus.PendingSecondPlayer,
      player1: {
        id:user.id,
        login:user.login,
        score:0
      },
      player2:{
        id:null,
        login:null,
        score:0
      },
      answers:[],
      questions:questionsList,
    }

    return await this.quizRepository.createNewGame(newGame)
  }
  async hasUserActiveGame(userId:number):Promise<void> {
    const isUserInActiveGame = await this.gameOrmRepository.createQueryBuilder("game")
      .where(new Brackets(qb =>
        qb
          .where("game.player1 ->> 'id' = :userId", { userId })
          .orWhere("game.player2 ->> 'id' = :userId", { userId })
      ))
      .andWhere(new Brackets(qb =>
        qb
          .where("game.status = :activeStatus", { activeStatus: GameStatus.Active })
          .orWhere("game.status = :pendingStatus", { pendingStatus: GameStatus.PendingSecondPlayer })
      ))
      .getCount();
    if (isUserInActiveGame > 0) {
      throw new ForbiddenException("User is already participating in an active game.");
    }
  }

  async getActiveUserGame(userId:number):Promise<GameEntity> {
    const userGame = await this.gameOrmRepository.createQueryBuilder("game")
      .where(new Brackets(qb =>
        qb
          .where("game.player1 ->> 'id' = :userId", { userId })
          .orWhere("game.player2 ->> 'id' = :userId", { userId })
      ))
      .andWhere("game.status = :status", { status: GameStatus.Active })
      .getOne();

    if(!userGame) throw new ForbiddenException()

    return userGame
  }

  async getUserUnfinishedGame(userId: number): Promise<GameEntity> {
    const userGame = await this.gameOrmRepository.createQueryBuilder("game")
      .where(new Brackets(qb =>
        qb
          .where("game.player1 ->> 'id' = :userId", { userId })
          .orWhere("game.player2 ->> 'id' = :userId", { userId })
      ))
      .andWhere(new Brackets(qb =>
        qb
          .where("game.status = :activeStatus", { activeStatus: GameStatus.Active })
          .orWhere("game.status = :pendingStatus", { pendingStatus: GameStatus.PendingSecondPlayer })
      ))
      .getOne();

    if (!userGame) {
      throw new NotFoundException('Game not found');
    }

    return userGame;
  }
}