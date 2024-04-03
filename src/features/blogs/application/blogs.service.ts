import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogDb, BlogQueryModel, CreateBlogDto } from "../api/models/input";
import { BlogsQueryRepository } from "../infrastructure/blogs.query.repository";
import { Pagination } from "../../../base/types/pagination.type";
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { BlogDocument } from "../../../infrastructure/domains/schemas/blogs.schema";
import { blogsMapper } from "../../../infrastructure/mappers/blogs.mapper";
import { OutputBlogModel } from "../api/models/output";
import { PostQueryModel } from "../../posts/api/models/input";
import { PostsQueryRepository } from "../../posts/infrastructure/posts.query.repository";
import { OutputPostModel } from "../../posts/api/models/output";

@Injectable()
export class BlogsService {
  constructor(private blogsRepository:BlogsRepository,
              private blogsQueryRepository:BlogsQueryRepository,
              private postsQueryRepository:PostsQueryRepository) {}

  async deleteBlog(id:string):Promise<void> {
    const blog = await this.blogsQueryRepository.isBlog(id)

    if(!blog) throw new NotFoundException('Es gibt kein Blog')

    return await this.blogsRepository.deleteBlog(id)
  }


  async getBlogById(id:string):Promise<OutputBlogModel> {
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

    const createdBlog:BlogDocument = await this.blogsRepository.createBlog(blogInfo)

    return blogsMapper(createdBlog)
  }


  async updateBlogById(id:string, dto:CreateBlogDto):Promise<void> {
    const blog = await this.blogsQueryRepository.isBlog(id)

    if(!blog) throw new NotFoundException('Blog is not exist')

    return await this.blogsRepository.updateBlog(id, dto)
  }

  async getBlogs(query:BlogQueryModel):Promise<Pagination<OutputBlogModel>>{
    const sortData = {
      searchNameTerm:query.searchNameTerm ?? null,
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "desc",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

   return await this.blogsQueryRepository.getBlogs(sortData)
  }


  async getPostsForBlog(query:PostQueryModel, userId:string, blogId:string):Promise<Pagination<OutputPostModel>>{
    const blog = await this.blogsQueryRepository.isBlog(blogId)
    if(!blog) throw new NotFoundException('Es gibt kein Blog')

    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "desc",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }
    return await this.postsQueryRepository.getPostsForBlog(sortData, userId, blogId)
  }
}