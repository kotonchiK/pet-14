import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { BlogsEntity } from "../domains/blogs.entity";
import { BlogDb, CreateBlogDto } from "../../api/models/input";

export class BlogsRepository_TYPEORM {
  constructor(@InjectModel(BlogsEntity) private blogsRepository: Repository<BlogsEntity>) {}
  async createBlog(newBlog:BlogDb):Promise<BlogsEntity | null> {
    try {
      return await this.blogsRepository.save(newBlog)
    } catch (e) {
      console.log('Create-User error => ', e)
      return null
    }
  }

  async updateBlog(id:number, dto:CreateBlogDto):Promise<void> {
    try {
      const blog = await this.blogsRepository.findOne({where:{id:id}})
      blog.name = dto.name
      blog.description = dto.description
      blog.websiteUrl = dto.websiteUrl
      await this.blogsRepository.save(blog)
    } catch (e) {
      console.log('Blog-Update error => ', e)
      throw new NotFoundException()
    }
  }

  async deleteBlog(id:number):Promise<void> {
    try {
      const blog = await this.blogsRepository.findOne({ where:{id:id} })
      await this.blogsRepository.remove(blog)
    } catch (e) {
      console.log('Delete-User error => ', e)
      throw new NotFoundException()
    }
  }
}