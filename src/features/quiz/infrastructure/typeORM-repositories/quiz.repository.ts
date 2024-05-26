import { InternalServerErrorException } from "@nestjs/common";
import { Brackets, ILike, Repository } from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {gameMapper} from "../../application/game.mapper";
import { GameEntity } from "../domains/game.entity";
import { GameDb } from "../../api/models/db";
import { OutputGameModel } from "../../api/models/game.output";
import { GameStatus } from "../../api/models/output";
import { UsersQueryModel } from "../../../users/api/models/input";
import { Pagination } from "../../../../base/types/pagination.type";
import { OutputUserModel } from "../../../users/api/models/output";
import { userMapper } from "../../../../infrastructure/mappers/users.mapper";
import { GamesQueryModel } from "../../api/models/input";
import { AnswersService } from "../../application/answers.service";
export class QuizRepository {
  constructor(@InjectRepository(GameEntity) private gameOrmRepository:Repository<GameEntity>,
              private answersService:AnswersService){}

  async getAllUserGames(userId: number, sortData: GamesQueryModel): Promise<Pagination<OutputGameModel>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;

    // Убедимся, что направление сортировки корректное
    const validatedSortDirection = sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Создаем конструктор запроса с начальными условиями
    const queryBuilder = this.gameOrmRepository.createQueryBuilder("game")
      .where(new Brackets(qb => {
        qb.where("game.player1 ->> 'id' = :userId", { userId })
          .orWhere("game.player2 ->> 'id' = :userId", { userId });
      }));

    // Обработка логики сортировки, удостоверимся, что sortBy является допустимым столбцом для избежания SQL-инъекций
      if (sortBy === 'status') {
        queryBuilder.orderBy("game.status", validatedSortDirection);
      } else {
        queryBuilder.orderBy(`game.${sortBy}`, validatedSortDirection);
      }

    // Реализуем пагинацию
    queryBuilder.addOrderBy("game.id", "DESC");
    queryBuilder.skip((pageNumber - 1) * pageSize);
    queryBuilder.take(pageSize);

    // Выполняем запрос и получаем результат
    const [games, totalCount] = await queryBuilder.getManyAndCount();

    // Рассчитываем общее количество страниц
    const pagesCount = Math.ceil(totalCount / pageSize);

    // Преобразуем игры в необходимый формат
    const sortGames: OutputGameModel[] = [];
    for (const game of games) {
      const { answersForFirstPlayer, answersForSecondPlayer } = await this.answersService.getAnswersForPlayers(game);
      const sortedGame = gameMapper(game, answersForFirstPlayer, answersForSecondPlayer);
      sortGames.push(sortedGame);
    }

    // Возвращаем результат с пагинацией
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: sortGames,
    };
  }

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