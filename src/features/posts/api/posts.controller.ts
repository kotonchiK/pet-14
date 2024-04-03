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
import { PostsService } from "../application/posts.service";
import { SortDirection } from "mongodb";
import { Pagination } from "../../../base/types/pagination.type";
import { CreatePostDto } from "./models/input";
import { OutputPostModel } from "./models/output";
import { OutputCommentModel } from "../../comments/api/models/output";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";

@Controller('/posts')
export class PostsController {
  constructor(private postsService:PostsService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getPosts(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:SortDirection,
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    ):Promise<Pagination<OutputPostModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize,
    }
    return await this.postsService.getPosts(query, '')
  }

  @Get(':id/comments')
  @UsePipes(ValidationPipe)
  async getCommentsForPost(
    @Param('id', ValidateObjectId) id:string,
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:SortDirection,
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
  ):Promise<Pagination<OutputCommentModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize
    }
    return await this.postsService.getCommentsForPost(query, id, '')
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getPostById(@Param('id', ValidateObjectId) id:string):Promise<OutputPostModel>{
    return await this.postsService.getPostById(id, '')
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPost(@Body() dto:CreatePostDto):Promise<OutputPostModel> {

    return await this.postsService.createPost(dto, '')
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async updatePostById(
    @Param('id', ValidateObjectId) id:string,
    @Body() dto:CreatePostDto):Promise<void>{

    return await this.postsService.updatePostById(id, dto)
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async deletePost(@Param('id', ValidateObjectId) id:string):Promise<void> {
    return await this.postsService.deletePost(id)
  }
}

