import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "../../../users/infrastructure/domains/users.entity";
import { Repository } from "typeorm";
import { PostsEntity, PostsLikesEntity } from "../domains/posts.entity";
import { PostsQueryRepository_TYPEORM } from "./posts.query.repository";
import { CreatePostDto, PostDb } from "../../api/models/input";
import { statusType } from "../../../../base/models/likeStatusDto";

export class PostsRepository_TYPEORM {
  constructor(
    @InjectRepository(PostsEntity) private postsRepository:Repository<PostsEntity>,
    @InjectRepository(PostsLikesEntity) private postsLikesRepository:Repository<PostsLikesEntity>,
    @InjectRepository(UsersEntity) private usersRepository:Repository<UsersEntity>,
    private postQueryRepo:PostsQueryRepository_TYPEORM) {}
  async createPost(newPost:PostDb):Promise<PostsEntity | null> {
    try {
      return await this.postsRepository.save(newPost)
    } catch (e) {
      console.log('Create-Post error => ', e)
      return null
    }
  }

  async updatePost(postId:number, dto:CreatePostDto):Promise<void> {
    try {
      const post = await this.postsRepository.findOne({ where:{id:postId }})
      post.title = dto.title
      post.shortDescription = dto.shortDescription
      post.content = dto.content
      await this.postsRepository.save(post)
    } catch (e) {
      console.log('Post-Update error => ', e)
    }
  }


  async deletePost(id:number):Promise<void> {
    try {
      const post = await this.postsRepository.findOne({where:{id:id}})
      await this.postsRepository.remove(post)
    } catch (e) {
      console.log('Delete-Post error => ', e)
    }
  }

  async updateLikeStatus(dto:statusType):Promise<boolean>{
    try {
      const post = await this.postQueryRepo.getPostById(dto.id, dto.userId)
      if(!post) return false

      let obWarUser = await this.postsLikesRepository.findOne({where:{postId:dto.id, userId:dto.userId}})
      if(!obWarUser) {
        const user = await this.usersRepository.findOne({where:{id:dto.userId}})
        const userData = {
          userId:dto.userId,
          postId:dto.id,
          status:dto.status,
          login:user!.login,
          addedAt:new Date()
        }
        await this.postsLikesRepository.save(userData);
      } else if (dto.status !== obWarUser.status) {
        obWarUser.status = dto.status
        obWarUser.addedAt = new Date()
        await this.postsLikesRepository.save(obWarUser)
      }

      return true
    } catch (e) {
      console.log('update like status for post => ', e)
      return false
    }
  }

}