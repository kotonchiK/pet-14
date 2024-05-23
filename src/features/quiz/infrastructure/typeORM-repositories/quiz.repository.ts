import { InternalServerErrorException } from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {gameMapper} from "../../application/game.mapper";
import { GameEntity } from "../domains/game.entity";
import { GameDb } from "../../api/models/db";
import { OutputGameModel } from "../../api/models/game.output";
import { GameStatus } from "../../api/models/output";
export class QuizRepository {
  constructor(@InjectRepository(GameEntity) private gameOrmRepository:Repository<GameEntity>){}

  async saveNewPaar(game:GameEntity):Promise<void> {
    try {
      await this.gameOrmRepository.save(game)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
  async createNewGame(newGame:GameDb):Promise<OutputGameModel>{
    try {

      const game = await this.gameOrmRepository.save(newGame)

      const answersForFirstPlayer = []
      const answersForSecondPlayer = []

      return gameMapper(game, answersForFirstPlayer, answersForSecondPlayer)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async isFreeGame():Promise<GameEntity | null>{
    const game =  await this.gameOrmRepository.findOne({where:{status:GameStatus.PendingSecondPlayer}})

    if(!game) return null

    return game
  }
}