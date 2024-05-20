import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Like, Repository } from "typeorm";
import { BlogsEntity } from "../domains/blogs.entity";
import { OutputBlogModel } from "../../api/models/output";
import { blogsMapper2 } from "../../../../infrastructure/mappers/blogs.mapper";
import { BlogQueryModel } from "../../api/models/input";
import { Pagination } from "../../../../base/types/pagination.type";


export class BlogsQueryRepository_TYPEORM {
  constructor(
    @InjectRepository(BlogsEntity) private blogsRepository:Repository<BlogsEntity>) {}

  async getBlogById(blogId:number):Promise<OutputBlogModel> {
    const blog = await this.blogsRepository.findOne({where:{ id:blogId }})

    return blogsMapper2(blog)
  }

  async getBlogs(sortData:BlogQueryModel):Promise<Pagination<OutputBlogModel>> {
    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = ILike(`%${searchNameTerm}%`);
    }

    const [blogs, totalCount] = await this.blogsRepository.findAndCount({
      where: filter,
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: blogs.map(blogsMapper2)
    }
  }
  async isBlog(blogId: number): Promise<boolean> {
    try {
      const blog = await this.blogsRepository.findOne({where:{id:blogId} });
      return !!blog;
    } catch (error) {
      console.log(`Error while checking blog: ${error}`);
      return false;
    }
  }
}