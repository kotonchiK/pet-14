import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException,} from "@nestjs/common";
import {QuestionsRepository} from "../infrastructure/typeORM-repositories/questions.repository";
import {InjectRepository} from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Answers, GameStatus } from "../api/models/output";
import { QuizRepository } from "../infrastructure/typeORM-repositories/quiz.repository";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { GameEntity, StatisticEntity } from "../infrastructure/domains/game.entity";
import { OutputGameModel } from "../api/models/game.output";
import { GameDb } from "../api/models/db";

@Injectable()
export class GameService {
  constructor(private questionsRepository:QuestionsRepository,
              private quizRepository:QuizRepository,
              private userRepository:UsersRepository_TYPEORM,
              @InjectRepository(GameEntity) private gameOrmRepository:Repository<GameEntity>,
              @InjectRepository(StatisticEntity) private statRepo:Repository<StatisticEntity>) {}

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

  async finishTheGame(game:GameEntity, answersForFirstPlayer:Answers[], answersForSecondPlayer:Answers[]): Promise<void> {
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

    await this.saveGame(game)

    const finishedGame = await this.gameOrmRepository.findOne({where:{id:game.id}})

    await this.updateStatistic(finishedGame)

  }
  async updateStatistic(game: GameEntity): Promise<void> {
    const user1 = game.player1;
    const user2 = game.player2;

    const user_1_Stat = await this.statRepo.findOne({ where: { userId: user1.id } });
    const user_2_Stat = await this.statRepo.findOne({ where: { userId: user2.id } });

    let winsCount_1 = 0;
    let lossesCount_1 = 0;
    let drawsCount_1 = 0;

    let winsCount_2 = 0;
    let lossesCount_2 = 0;
    let drawsCount_2 = 0;

    if (user1.score > user2.score) {
      winsCount_1 = 1;
      lossesCount_2 = 1;
    } else if (user2.score > user1.score) {
      winsCount_2 = 1;
      lossesCount_1 = 1;
    } else {
      drawsCount_1 = 1;
      drawsCount_2 = 1;
    }

    // Обработка статистики первого пользователя
    if (!user_1_Stat) {
      // Создание новой записи
      const newStatistic = {
        userId: user1.id,
        sumScore: user1.score,
        gamesCount: 1,
        winsCount: winsCount_1,
        lossesCount: lossesCount_1,
        drawsCount: drawsCount_1
      };

      await this.statRepo.save(newStatistic);
    } else {
      // Обновление существующей записи
      user_1_Stat.gamesCount += 1;
      user_1_Stat.sumScore += user1.score;
      user_1_Stat.winsCount += winsCount_1;
      user_1_Stat.lossesCount += lossesCount_1;
      user_1_Stat.drawsCount += drawsCount_1;

      await this.statRepo.save(user_1_Stat);
    }

    // Обработка статистики второго пользователя
    if (!user_2_Stat) {
      // Создание новой записи
      const newStatistic = {
        userId: user2.id,
        sumScore: user2.score,
        gamesCount: 1,
        winsCount: winsCount_2,
        lossesCount: lossesCount_2,
        drawsCount: drawsCount_2
      };

      await this.statRepo.save(newStatistic);
    } else {
      // Обновление существующей записи
      user_2_Stat.gamesCount += 1;
      user_2_Stat.sumScore += user2.score;
      user_2_Stat.winsCount += winsCount_2;
      user_2_Stat.lossesCount += lossesCount_2;
      user_2_Stat.drawsCount += drawsCount_2;

      await this.statRepo.save(user_2_Stat);
    }
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