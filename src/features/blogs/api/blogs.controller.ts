import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { BlogsService } from "../application/blogs.service";
import { OutputBlogModel } from "./models/output";
import { SortDirection } from "mongodb";
import { Pagination } from "../../../base/types/pagination.type";
import { CreateBlogDto, CreatePostBlogDto } from "./models/input";
import { PostsService } from "../../posts/application/posts.service";
import { OutputPostModel } from "../../posts/api/models/output";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";

@Controller('/blogs')
export class BlogsController {
  constructor(private blogsService:BlogsService,
              private postsService:PostsService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getBlogs(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:SortDirection,
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    @Query('searchNameTerm') searchNameTerm:string,
    ):Promise<Pagination<OutputBlogModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize,
      searchNameTerm:searchNameTerm,
    }
    return await this.blogsService.getBlogs(query)
  }

  @Get(':id/posts')
  @UsePipes(ValidationPipe)
  async getPostsForBlog(
    @Param('id', ValidateObjectId) id:string,
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:SortDirection,
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
  ):Promise<Pagination<OutputPostModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize
    }

    return await this.blogsService.getPostsForBlog(query, '', id)
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getBlogById(@Param('id', ValidateObjectId) id:string):Promise<OutputBlogModel>{
    return await this.blogsService.getBlogById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createBlog(@Body() dto:CreateBlogDto):Promise<OutputBlogModel> {

    return await this.blogsService.createBlog(dto)
  }

  @Post(':id/posts')
  @UsePipes(ValidationPipe)
  async createPostForBlog(
    @Param('id', ValidateObjectId) id:string,
    @Body() dto:CreatePostBlogDto):Promise<OutputPostModel> {
    const newDto = {
      ...dto,
      blogId:id
    }
    return await this.postsService.createPost(newDto, '')
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async updateBlogById(
    @Param('id', ValidateObjectId) id:string,
    @Body() dto:CreateBlogDto):Promise<void>{
    return await this.blogsService.updateBlogById(id, dto)
  }


  @Delete(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async deleteBlog(@Param('id', ValidateObjectId) id:string):Promise<void> {
    return await this.blogsService.deleteBlog(id)
  }
}

