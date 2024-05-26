import { BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import {gameMapper} from "./game.mapper";
import { Answers, GameStatus, Statistic } from "../api/models/output";
import { QuizRepository } from "../infrastructure/typeORM-repositories/quiz.repository";
import { GameService } from "./game.service";
import { AnswersService } from "./answers.service";
import { QuestionsService } from "./questions.service";
import { UsersRepository_TYPEORM } from "../../users/infrastructure/typeORM-repositories/users.repository";
import { OutputGameModel } from "../api/models/game.output";
import { InjectRepository } from "@nestjs/typeorm";
import { StatisticEntity } from "../infrastructure/domains/game.entity";
import { Repository } from "typeorm";
import { statisticMapper } from "./statistic.mapper";
import { GamesQueryModel } from "../api/models/input";

@Injectable()
export class QuizService {
  constructor(private quizRepository:QuizRepository,
              private gameService:GameService,
              private answersService:AnswersService,
              private questionsService:QuestionsService,
              private userRepository:UsersRepository_TYPEORM,
              @InjectRepository(StatisticEntity) private statisticRepo:Repository<StatisticEntity>) {}


  async getAllUserGames(userId:number, query:GamesQueryModel) {

    const sortData = {
      sortBy:query.sortBy ?? "pairCreatedDate",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

    return await this.quizRepository.getAllUserGames(userId, sortData)
  }

  async getStatisticForUser(userId:number):Promise<Statistic> {

    const games = await this.statisticRepo.findOne({where:{userId:userId}})

    if(!games) return statisticMapper()

    return statisticMapper(games)

  }
  async getUserUnfinishedGame(userId:number):Promise<OutputGameModel>{

    const game = await this.gameService.getUserUnfinishedGame(userId)

    const {answersForFirstPlayer, answersForSecondPlayer} = await this.answersService.getAnswersForPlayers(game)

    return gameMapper(game, answersForFirstPlayer, answersForSecondPlayer)
  }

  async getGameById(userId:number, gameId:number):Promise<OutputGameModel>{

    const game = await this.gameService.getGameById(gameId)

    if(game.player1.id !== Number(userId) && game.player2.id !== Number(userId)) throw new ForbiddenException()

    const {answersForFirstPlayer, answersForSecondPlayer} = await this.answersService.getAnswersForPlayers(game)

    return gameMapper(game, answersForFirstPlayer, answersForSecondPlayer)
  }

  async answerOnQuestion(answer:string, userId:number):Promise<Answers> {
    const user = await this.userRepository.getUserEntity(userId)

    const game = await this.gameService.getActiveUserGame(userId)

    let questionId:number

    if(game.player1.id === Number(userId)) {
        questionId = await this.answersService.getQuestionForFirst(game.questions)
      } else if(game.player2.id === Number(userId)) {
        questionId = await this.answersService.getQuestionForSecond(game.questions)
      } else {
        throw new BadRequestException()
      }

    const questionsEntity = await this.questionsService.getQuestionEntity(questionId)

    const answers = questionsEntity.correctAnswers

    const answerStatus = answers.includes(answer)

    let status:string
    if(answerStatus === false)  {
      status = 'Incorrect'
    } else  {
      status = 'Correct'
      if(Number(userId) === game.player1.id)
      {
        game.player1.score += 1
      } else if(Number(userId) === game.player2.id) {
        game.player2.score += 1
      }
    }

    const answerOnQuestion = {
      questionId,
      answerStatus:status,
      userId,
      login:user.login,
      addedAt:new Date()
    }

    game.answers.push(answerOnQuestion)

    await this.gameService.saveGame(game)

    if(this.answersService.wasTheLastAnswer(game.questions)) {
      /**
       * Если не достать новый gameEntity, то будут ошибочны вычисления с дополнительным баллом
       * Проблема связана с addedAt у последнего входящего ответа
       */
      const finalGame = await this.gameService.getGameById(game.id)

      const {answersForFirstPlayer, answersForSecondPlayer} = await this.answersService.getAnswersForPlayers(finalGame);
      await this.gameService.finishTheGame(finalGame, answersForFirstPlayer, answersForSecondPlayer)

    }

    return {
      questionId:questionId.toString(),
      answerStatus:answerOnQuestion.answerStatus,
      addedAt:answerOnQuestion.addedAt
    }
  }

  async connection(userId:number):Promise<OutputGameModel> {

    await this.gameService.hasUserActiveGame(userId)

    const isFreeGame = await this.quizRepository.isFreeGame()

    if(!isFreeGame) return await this.gameService.createNewGame(userId)

    // Create new Paar

    const user2 = await this.userRepository.getUserEntity(userId)

    isFreeGame.player2.id = user2.id
    isFreeGame.player2.login = user2.login
    isFreeGame.status = GameStatus.Active
    isFreeGame.startGameDate = new Date()

    await this.quizRepository.saveNewPaar(isFreeGame)

    return gameMapper(isFreeGame, [], [])
  }
}