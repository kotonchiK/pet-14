import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { BlogQueryModel } from "../api/models/input";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputBlogModel } from "../api/models/output";
import { Blog, BlogDocument } from "../../../infrastructure/domains/schemas/blogs.schema";
import { blogsMapper } from "../../../infrastructure/mappers/blogs.mapper";

export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel:Model<BlogDocument>) {}

  async getBlogById(blogId:string):Promise<OutputBlogModel> {
    const blog = await this.blogModel.findById(new ObjectId(blogId))

    return blogsMapper(blog)
  }

  async getBlogs(sortData:BlogQueryModel):Promise<Pagination<OutputBlogModel>> {
    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {
      name:{
        $regex:searchNameTerm || '', $options:'i'} }
    const blogs = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
    const totalCount = await this.blogModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: blogs.map(blogsMapper)
    }
  }
  async isBlog(blogId: string): Promise<boolean> {
    try {
      const blog = await this.blogModel.findById(new ObjectId(blogId));
      return !!blog;
    } catch (error) {
      console.log(`Error while checking blog: ${error}`);
      return false;
    }
  }
}