import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogDb, BlogQueryModel, CreateBlogDto } from "../api/models/input";
import { BlogsQueryRepository } from "../infrastructure/blogs.query.repository";
import { Pagination } from "../../../base/types/pagination.type";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { BlogDocument, BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { blogsMapper, blogsMapper2 } from "../../../infrastructure/mappers/blogs.mapper";
import { OutputBlogModel } from "../api/models/output";
import { PostQueryModel } from "../../posts/api/models/input";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { OutputPostModel } from "../../posts/api/models/output";

@Injectable()
export class BlogsService {
  constructor(private blogsRepository:BlogsRepository,
              private blogsQueryRepository:BlogsQueryRepository,
              private postsQueryRepository:PostsQueryRepository) {}

  async deleteBlog(id:number):Promise<void> {
     await this.blogsRepository.deleteBlog(id)
  }


  async getBlogById(id:number):Promise<OutputBlogModel> {
    const blog = await this.blogsQueryRepository.isBlog(id)

    if(!blog) throw new NotFoundException('Es gibt kein Blog')

    return await this.blogsQueryRepository.getBlogById(id)
  }

  async createBlog(dto:CreateBlogDto):Promise<OutputBlogModel> {
    const blogInfo:BlogDb = {
      name:dto.name,
      description: dto.description,
      websiteUrl:dto.websiteUrl,
      createdAt:new Date(),
      isMembership:false
    }
    const blog = await this.blogsRepository.createBlog(blogInfo)

    return blogsMapper2(blog)
  }


  async updateBlogById(id:number, dto:CreateBlogDto):Promise<void> {
    await this.blogsRepository.updateBlog(id, dto)
  }

  async getBlogs(query:BlogQueryModel):Promise<Pagination<OutputBlogModel>>{
    const sortData = {
      searchNameTerm:query.searchNameTerm ?? null,
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

   return await this.blogsQueryRepository.getBlogs(sortData)
  }


  async getPostsForBlog(query:PostQueryModel, userId:number, blogId:number):Promise<Pagination<OutputPostModel>>{
   // const blog = await this.blogsQueryRepository.isBlog(blogId)
    // if(!blog) throw new NotFoundException('Es gibt kein Blog')

    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }
    return await this.postsQueryRepository.getPostsForBlog(sortData, userId, blogId)
  }
}