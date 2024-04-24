import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  Post,
  Put,
  Query, Req, UseGuards,
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
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";
import { CreateCommentDto } from "../../comments/api/models/input";
import { Request } from "express";
import { CommentsService } from "../../comments/application/comments.service";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { CurrentUserIdPipe } from "../../../infrastructure/pipes/currentUserId.pipe";
import { LikeStatusDto } from "../../../base/models/likeStatusDto";
import { ValidateIdPipe } from "../../../infrastructure/pipes/ValidateIdNumber";

@Controller('/posts')
export class PostsController {
  constructor(private postsService:PostsService,
              private commentService:CommentsService,
              private commentQueryRepo:CommentsQueryRepository) {}

  @Get()
  @UsePipes(ValidationPipe)
  @UsePipes(CurrentUserIdPipe)
  async getPosts(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:'ASC' | 'DESC',
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    @Req() req:Request
    ):Promise<Pagination<OutputPostModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize,
    }
    return await this.postsService.getPosts(query, req.userId)
  }

  @Get(':id/comments')
  @UsePipes(ValidationPipe)
  @UsePipes(CurrentUserIdPipe)
  async getCommentsForPost(
    @Param('id', ValidateIdPipe) id:number,
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:'ASC' | 'DESC',
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    @Req() req:Request
  ):Promise<Pagination<OutputCommentModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize
    }
    return await this.postsService.getCommentsForPost(query, id, req.userId)
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UsePipes(CurrentUserIdPipe)
  async getPostById(@Param('id', ValidateIdPipe) id:number,
                    @Req() req:Request):Promise<OutputPostModel>{
    return await this.postsService.getPostById(id, req.userId)
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto:CreatePostDto):Promise<OutputPostModel> {

    return await this.postsService.createPost(dto, 0)
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(
    @Param('id', ValidateIdPipe) id:number,
    @Body() dto:CreatePostDto):Promise<void>{

    return await this.postsService.updatePostById(id, dto)
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', ValidateIdPipe) id:number):Promise<void> {
    return await this.postsService.deletePost(id)
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentForPost(@Param('id', ValidateIdPipe) id:number,
                             @Req() req: Request,
                             @Body() dto:CreateCommentDto):Promise<OutputCommentModel> {
    const postId = id
    const userId = req.userId
    const content = dto.content

    return await this.commentService.createComment(postId, userId, content)
  }

  @Get(':id/comments')
  @UsePipes(CurrentUserIdPipe)
  async getCommentForPost(
    @Param('id', ValidateIdPipe) id:number,
    @Req() req: Request,
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:'ASC' | 'DESC',
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
  ):Promise<Pagination<OutputCommentModel>> {
    const postId = id
    const userId = req.userId
    const query = {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize
    }

    return await this.commentQueryRepo.getCommentsForPost(query, postId, userId)
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setLikeStatus(@Req() req: Request,
                      @Param('id', ValidateIdPipe) id:number,
                      @Body() status:LikeStatusDto):Promise<void>{
    const statusData = {
      id,
      status:req.body.likeStatus,
      userId:req.userId
    }
    await this.postsService.setLikeStatus(statusData)
  }

}
