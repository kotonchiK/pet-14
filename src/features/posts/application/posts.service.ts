import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto, PostDb, PostQueryModel } from "../api/models/input";
import { PostsQueryRepository } from "../infrastructure/posts.query.repository";
import { Pagination } from "../../../base/types/pagination.type";
import { PostsRepository } from "../infrastructure/posts.repository";
import {  OutputPostModel } from "../api/models/output";
import { BlogsQueryRepository } from "../../blogs/infrastructure/blogs.query.repository";
import { PostDocument } from "../../../infrastructure/domains/schemas/posts.schema";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query.repository";
import { OutputCommentModel } from "../../comments/api/models/output";
import { statusType } from "../../../base/models/likeStatusDto";
import { PostsRepository_TYPEORM } from "../infrastructure/typeORM/posts.repository";
import { PostsQueryRepository_TYPEORM } from "../infrastructure/typeORM/posts.query.repository";
import { BlogsQueryRepository_TYPEORM } from "../../blogs/infrastructure/typeORM-repositories/blogs.query.repository";
import { CommentsQueryRepository_TYPEORM } from "../../comments/infrastructure/typeORM/comments.query.repository";

@Injectable()
export class PostsService {
  constructor(private postsRepository:PostsRepository_TYPEORM,
              private postsQueryRepository:PostsQueryRepository_TYPEORM,
              private blogQueryRepository:BlogsQueryRepository_TYPEORM,
              private commentsQueryRepository:CommentsQueryRepository_TYPEORM) {}

  async deletePost(id:number):Promise<void> {
    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not exist')

    return await this.postsRepository.deletePost(id)
  }


  async getPostById(id:number, userId:number):Promise<OutputPostModel> {
    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not exist')

    return await this.postsQueryRepository.getPostById(id, userId)
  }


  async createPost(dto:CreatePostDto, userId:number):Promise<OutputPostModel> {
    const blog = await this.blogQueryRepository.isBlog(dto.blogId)

    if(!blog) throw new NotFoundException({message:'Blog is not exist'})

    const blogInfo = await this.blogQueryRepository.getBlogById(dto.blogId)

    const postInfo:PostDb = {
      title:dto.title,
      shortDescription: dto.shortDescription,
      content:dto.content,
      createdAt:new Date(),
      blogId:dto.blogId,
      blogName:blogInfo.name
    }

    const createdPost = await this.postsRepository.createPost(postInfo)

    const postId = createdPost.id

    return await this.postsQueryRepository.getPostById(postId, userId)
  }

  async updatePostById2(id:number, dto:CreatePostDto):Promise<void> {

    const blog = await this.blogQueryRepository.isBlog(dto.blogId)

    if(!blog) throw new NotFoundException({message:'Blog is not exist', field:'blogId'})

    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not found')

    return await this.postsRepository.updatePost(id, dto)
  }


  async updatePostById(id:number, dto:CreatePostDto):Promise<void> {

    const blog = await this.blogQueryRepository.isBlog(dto.blogId)

    if(!blog) throw new BadRequestException({message:'Blog is not exist', field:'blogId'})

    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not found')

    return await this.postsRepository.updatePost(id, dto)
  }

  async getPosts(query:PostQueryModel, userId:number):Promise<Pagination<OutputPostModel>>{
    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }
   return await this.postsQueryRepository.getAllPosts(sortData, userId)
  }

  async getCommentsForPost(query:PostQueryModel, postId:number, userId:number):Promise<Pagination<OutputCommentModel>>{
    const post = await this.postsQueryRepository.isPost(postId)
    if(!post) throw new NotFoundException('Post is not exist')

    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

    return await this.commentsQueryRepository.getCommentsForPost(sortData, postId, userId)

  }
  async setLikeStatus(dto:statusType):Promise<void> {
    const isPost = await this.postsQueryRepository.isPost(dto.id)
    if(!isPost) throw new NotFoundException('Comment is not exist')

    const likeStatus = await this.postsRepository.updateLikeStatus(dto)

    if(!likeStatus) throw new BadRequestException({message:'Status was not updated', field:'likeStatus'})
  }

}