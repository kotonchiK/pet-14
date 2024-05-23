import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import {QuestionsQueryModel} from "../../api/models/input";
import { Pagination } from "../../../../base/types/pagination.type";
import {questionMapper} from "../../application/quiz.mapper";
import {OutputQuestionModel} from "../../api/models/output";
import { QuestionEntity } from "../domains/question.entity";

export class QuestionsQueryRepository {
  constructor(@InjectRepository(QuestionEntity) private questionOrmRepository:Repository<QuestionEntity>) {}

  async isQuestion(questionId:number):Promise<boolean> {
    try {
      const question = await this.questionOrmRepository.findOne({where:{id:questionId}});
      return !!question;
    } catch (error) {
      console.log(`Error while checking user: ${error}`);
      return false;
    }
  }
  async getQuestions(query:QuestionsQueryModel):Promise<Pagination<OutputQuestionModel>> {

    const sortData:QuestionsQueryModel = {
      bodySearchTerm:query.bodySearchTerm ?? null,
      publishedStatus:query.publishedStatus ?? 'all',
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

    let publishStatus: boolean = null;
    if (sortData.publishedStatus === 'published') publishStatus = true;
    if (sortData.publishedStatus === 'notPublished') publishStatus = false;

    const where: any = {
      body: ILike(`%${sortData.bodySearchTerm || ''}%`)
    };
    if (publishStatus !== null) {
      where.publish = publishStatus;
    }

    const filter = {
      where,
      order: { [sortData.sortBy]: sortData.sortDirection },
      skip: (sortData.pageNumber - 1) * sortData.pageSize,
      take: sortData.pageSize,
    };
    const [questions, totalCount] = await this.questionOrmRepository.findAndCount(filter);

    const pagesCount = Math.ceil(totalCount / sortData.pageSize)

    return {
      pageSize:sortData.pageSize,
      page: sortData.pageNumber,
      pagesCount,
      totalCount,
      items: questions.map(questionMapper)
    }
  }
}