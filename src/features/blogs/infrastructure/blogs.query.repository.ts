import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { BlogQueryModel } from "../api/models/input";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputBlogModel } from "../api/models/output";
import { Blog, BlogDocument, BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { blogsMapper, blogsMapper2 } from "../../../infrastructure/mappers/blogs.mapper";
import { InjectModel } from "@nestjs/sequelize";
import { Op, OrderItem } from "sequelize";


export class BlogsQueryRepository {
  constructor(@InjectModel(BlogTest) private readonly blogModel: typeof BlogTest) {}

  async getBlogById(blogId:number):Promise<OutputBlogModel> {
    const blog = await this.blogModel.findByPk(blogId)

    return blogsMapper2(blog)
  }

  async getBlogs(sortData:BlogQueryModel):Promise<Pagination<OutputBlogModel>> {
    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = {
        [Op.iLike]: `%${searchNameTerm}%`,
      };
    }

    const blogs = await this.blogModel.findAll({
      where: filter,
      order: [[sortBy, sortDirection]],
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      raw: true,
    });
    const totalCount = await this.blogModel.count({ where: filter });
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
      const blog = await this.blogModel.findByPk(blogId);
      return !!blog;
    } catch (error) {
      console.log(`Error while checking blog: ${error}`);
      return false;
    }
  }
}