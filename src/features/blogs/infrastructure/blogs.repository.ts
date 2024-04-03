import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { BlogDb, CreateBlogDto } from "../api/models/input";
import { Blog, BlogDocument } from "../../../infrastructure/domains/schemas/blogs.schema";

export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel:Model<BlogDocument>) {}
  async createBlog(newBlog:BlogDb):Promise<BlogDocument | null> {
    try {
      const createdBlog = new this.blogModel(newBlog)

      await createdBlog.save()

      return createdBlog

    } catch (e) {
      console.log('Create-User error => ', e)
      return null
    }
  }

  async updateBlog(id:string, dto:CreateBlogDto):Promise<void> {
    try {
      await this.blogModel.findByIdAndUpdate(new ObjectId(id), dto)
    } catch (e) {
      console.log('Blog-Update error => ', e)
    }
  }


  async deleteBlog(id:string):Promise<void> {
    try {
      await this.blogModel.findByIdAndDelete(new ObjectId(id))
    } catch (e) {
      console.log('Delete-User error => ', e)
    }
  }
}