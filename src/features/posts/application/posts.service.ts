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

@Injectable()
export class PostsService {
  constructor(private postsRepository:PostsRepository,
              private postsQueryRepository:PostsQueryRepository,
              private blogQueryRepository:BlogsQueryRepository,
              private commentsQueryRepository:CommentsQueryRepository) {}

  async deletePost(id:string):Promise<void> {
    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not exist')

    return await this.postsRepository.deletePost(id)
  }


  async getPostById(id:string, userId:string):Promise<OutputPostModel> {
    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not exist')

    return await this.postsQueryRepository.getPostById(id, userId)
  }


  async createPost(dto:CreatePostDto, userId:string):Promise<OutputPostModel> {
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

    const createdPost:PostDocument = await this.postsRepository.createPost(postInfo)

    const postId = createdPost._id.toString()

    return await this.postsQueryRepository.getPostById(postId, userId)
  }


  async updatePostById(id:string, dto:CreatePostDto):Promise<void> {

    const blog = await this.blogQueryRepository.isBlog(dto.blogId)

    if(!blog) throw new BadRequestException({message:'Blog is not exist', field:'blogId'})

    const post = await this.postsQueryRepository.isPost(id)

    if(!post) throw new NotFoundException('Post is not found')

    return await this.postsRepository.updatePost(id, dto)
  }

  async getPosts(query:PostQueryModel, userId:string):Promise<Pagination<OutputPostModel>>{
    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "desc",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }
   return await this.postsQueryRepository.getAllPosts(sortData, userId)
  }

  async getCommentsForPost(query:PostQueryModel, postId:string, userId:string):Promise<Pagination<OutputCommentModel>>{
    const post = await this.postsQueryRepository.isPost(postId)
    if(!post) throw new NotFoundException('Post is not exist')

    const sortData = {
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "desc",
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