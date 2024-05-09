import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus, NotFoundException,
  Param, ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { BlogsService } from "../application/blogs.service";
import { PostsService } from "../../posts/application/posts.service";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputBlogModel } from "./models/output";
import { CurrentUserIdPipe } from "../../../infrastructure/pipes/currentUserId.pipe";
import { ValidateIdPipe } from "../../../infrastructure/pipes/ValidateIdNumber";
import { Request } from "express";
import { OutputPostModel } from "../../posts/api/models/output";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";
import { CreateBlogDto, CreatePostBlogDto } from "./models/input";

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(private blogsService:BlogsService,
              private postsService:PostsService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getBlogs(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:'ASC' | 'DESC',
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
  @UsePipes(CurrentUserIdPipe)
  async getPostsForBlog(
    @Param('id', ValidateIdPipe) id:number,
    @Req() req:Request,

    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:"ASC" | "DESC",
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
  ):Promise<Pagination<OutputPostModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize
    }

    return await this.blogsService.getPostsForBlog(query, req.userId, id)
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getBlogById(@Param('id', ValidateIdPipe) id:number):Promise<OutputBlogModel>{
    return await this.blogsService.getBlogById(id)
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto:CreateBlogDto):Promise<OutputBlogModel> {
    return await this.blogsService.createBlog(dto)
  }

  @Post(':id/posts')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('id', ValidateIdPipe) id:number,
    @Body() dto:CreatePostBlogDto):Promise<OutputPostModel> {
    const newDto = {
      ...dto,
      blogId:id
    }
    return await this.postsService.createPost(newDto, 0)
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogById(
    @Param('id', ValidateIdPipe) id:number,
    @Body() dto:CreateBlogDto):Promise<void>{
    return await this.blogsService.updateBlogById(id, dto)
  }


  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id', ValidateIdPipe) id:number):Promise<void> {
    return await this.blogsService.deleteBlog(id)
  }

  @Put(':blogId/posts/:postId')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostForBlogById(
    @Param('blogId', ParseIntPipe) blogId:number,
    @Param('postId', ParseIntPipe) postId:number,
    @Body() dto:CreatePostBlogDto):Promise<void>{

    const info = {
      title:dto.title,
      shortDescription:dto.shortDescription,
      content:dto.content,
      blogId:blogId
    }
    return await this.postsService.updatePostById2(postId, info)
  }

  @Delete(':blogId/posts/:postId')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostForBlogById(
    @Param('blogId', ParseIntPipe) blogId:number,
    @Param('postId', ParseIntPipe) postId:number,):Promise<void> {

    await this.blogsService.getBlogById(blogId)
    return await this.postsService.deletePost(postId)
  }

}

