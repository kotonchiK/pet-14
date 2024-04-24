import { BlogDb, CreateBlogDto } from "../api/models/input";
import { BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException } from "@nestjs/common";

export class BlogsRepository {
  constructor(@InjectModel(BlogTest) private readonly blogTestModel: typeof BlogTest) {}
  async createBlog(newBlog:BlogDb):Promise<BlogTest | null> {
    try {
      return await this.blogTestModel.create(newBlog)
    } catch (e) {
      console.log('Create-User error => ', e)
      return null
    }
  }

  async updateBlog(id:number, dto:CreateBlogDto):Promise<void> {
    try {
      const blog = await this.blogTestModel.findByPk(id)
      await blog.update(dto)
    } catch (e) {
      console.log('Blog-Update error => ', e)
      throw new NotFoundException()
    }
  }

  async deleteBlog(id:number):Promise<void> {
    try {
      const blog = await this.blogTestModel.findByPk(id)
      await blog.destroy()
    } catch (e) {
      console.log('Delete-User error => ', e)
      throw new NotFoundException()
    }
  }
}