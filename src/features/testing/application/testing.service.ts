import { Injectable } from "@nestjs/common";
import { BlogsEntity } from "../../blogs/infrastructure/domains/blogs.entity";
import { Repository } from "typeorm";
import { PostsEntity, PostsLikesEntity } from "../../posts/infrastructure/domains/posts.entity";
import { CommentsEntity } from "../../comments/infrastructure/domains/comments.entity";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "../../users/infrastructure/domains/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity, StatisticEntity } from "../../quiz/infrastructure/domains/game.entity";
import { QuestionEntity } from "../../quiz/infrastructure/domains/question.entity";

@Injectable()
export class TestingService {
  constructor(@InjectRepository(BlogsEntity) private blogModel:Repository<BlogsEntity>,
              @InjectRepository(PostsEntity) private postModel:Repository<PostsEntity>,
              @InjectRepository(CommentsEntity) private commentModel:Repository<CommentsEntity>,
              @InjectRepository(UsersEntity) private userModel:Repository<UsersEntity>,
              @InjectRepository(PostsLikesEntity) private postLikesModel:Repository<PostsLikesEntity>,
              @InjectRepository(TokensEntity) private tokensModel:Repository<TokensEntity>,
              @InjectRepository(PasswordChangeEntity) private passwordChangeModel:Repository<PasswordChangeEntity>,
              @InjectRepository(GameEntity) private gameModel:Repository<GameEntity>,
              @InjectRepository(QuestionEntity) private questionsModel:Repository<QuestionEntity>,
              @InjectRepository(StatisticEntity) private statisticModel:Repository<StatisticEntity>

  ) {}
  async deleteAllData():Promise<void>{
    // Удаление зависимых данных сначала
    await this.postLikesModel.delete({});
    await this.tokensModel.delete({});
    await this.passwordChangeModel.delete({});
    await this.gameModel.delete({});
    await this.statisticModel.delete({})


    // Удаление основных данных
    await this.commentModel.delete({});
    await this.postModel.delete({});
    await this.blogModel.delete({});
    await this.userModel.delete({});
    await this.questionsModel.delete({});
  }
}