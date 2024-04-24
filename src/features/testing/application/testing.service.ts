import { Injectable } from "@nestjs/common";
import { BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import {
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { CommentTest } from "../../../infrastructure/domains/schemas/comments.schema";
import {
  EmailConfirmationTest, passwordChangeTest,
  TokensTest,
UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class TestingService {
  constructor(@InjectModel(BlogTest) private blogModel:typeof BlogTest,
              @InjectModel(PostTest) private postModel:typeof PostTest,
              @InjectModel(CommentTest) private commentModel:typeof CommentTest,
              @InjectModel(UserTest) private userModel:typeof UserTest,
              @InjectModel(PostLikesTest) private postLikesModel:typeof PostLikesTest,
              @InjectModel(TokensTest) private tokensModel:typeof TokensTest,
              @InjectModel(passwordChangeTest) private passwordChangeModel:typeof passwordChangeTest,
              @InjectModel(EmailConfirmationTest) private emailConfirmationModel:typeof EmailConfirmationTest


  ) {}
  async deleteAllData():Promise<void>{
    await this.blogModel.destroy({ where: {} });
    await this.postModel.destroy({ where: {} });
    await this.commentModel.destroy({ where: {} });
    await this.userModel.destroy({ where: {} });
    await this.postLikesModel.destroy({ where: {} });
    await this.tokensModel.destroy({ where: {} });
    await this.passwordChangeModel.destroy({ where: {} });
    await this.emailConfirmationModel.destroy({ where: {} });
  }
}