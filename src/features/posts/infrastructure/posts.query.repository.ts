import { Pagination } from "../../../base/types/pagination.type";
import { OutputPostModel, postLikesInfo } from "../api/models/output";
import {
  Post,
  PostDocument,
  PostLikes,
  PostLikesTest,
  PostTest
} from "../../../infrastructure/domains/schemas/posts.schema";
import { postMapper } from "../../../infrastructure/mappers/posts.mapper";
import { PostQueryModel } from "../api/models/input";
import { InjectModel } from "@nestjs/sequelize";

export class PostsQueryRepository {
  constructor(@InjectModel(PostTest) private postModel:typeof PostTest,
              @InjectModel(PostLikesTest) private postLikesModel:typeof PostLikesTest) {}

  async getPostById(postId:number, userId:number):Promise<OutputPostModel> {
    const post = await this.postModel.findByPk(postId)

    const likesInfo = await this.postLikesInfo(postId, userId)

    return postMapper(post, likesInfo)
  }

  async getAllPosts(sortData:PostQueryModel, userId:number):Promise<Pagination<OutputPostModel>> {
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter: any = {};
    const posts = await this.postModel.findAll({
      where: filter,
      order: [[sortBy, sortDirection]],
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      raw: true,
    });

    const totalCount = await this.postModel.count({where:filter})
    const pagesCount = Math.ceil(totalCount / pageSize)

    let sortPost:OutputPostModel[] = []
    for(let i:number = 0; i < posts.length; i++){
      const post = posts[i]
      const postLikesInfo:postLikesInfo = await this.postLikesInfo(post.id, userId)
      const sortedComment:OutputPostModel = postMapper(post, postLikesInfo)
      sortPost.push(sortedComment)
    }

    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: sortPost
    }
  }

  async getPostsForBlog(sortData:PostQueryModel, userId:number, blogId:number):Promise<Pagination<OutputPostModel>> {
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {"blogId":blogId}
      const posts = await this.postModel.findAll({
        where: filter,
        order: [[sortBy, sortDirection]],
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        raw: true,
      });
    const totalCount = await this.postModel.count({where:filter})
    const pagesCount = Math.ceil(totalCount / pageSize)

    let sortPost:OutputPostModel[] = []
    for(let i:number = 0; i < posts.length; i++){
      const post = posts[i]
      const postLikesInfo:postLikesInfo = await this.postLikesInfo(post.id, userId)
      const sortedComment:OutputPostModel = postMapper(post, postLikesInfo)
      sortPost.push(sortedComment)
    }

    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: sortPost
    }
  }

  async postLikesInfo(postId: number, userId: number):Promise<postLikesInfo> {
    const likesArray = await this.postLikesModel.findAll({where:{"postId":postId}})
    if(likesArray.length === 0) {
      return {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes:[]
      }
    }
    let status = "None"
    if(userId > 0) {
      const user = likesArray.map((like) =>  {
        if (like.userId === userId) return like
        else {
          return null
        }
      });
      if (user[0]) status = user[0].status;
    }

    let likes: number = 0;
    let dislikes: number = 0;
    likesArray.forEach(userLike => {
      if (userLike.status === "Like") {
        likes++;
      } else if (userLike.status === "Dislike") {
        dislikes++;
      }
    });

    const sortedPost = likesArray.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

    const sortedPost2:any[] = sortedPost.filter(a => a.status === 'Like');

    let newPostsLikes:any[] = []

    for(let i = 0; i < 3; i++) {
      if(sortedPost2[i] !== undefined) {

        const like = {
          userId:sortedPost2[i].userId.toString(),
          login:sortedPost2[i].login,
          addedAt:sortedPost2[i].addedAt.toISOString()
        }
        newPostsLikes.push(like);
      }
    }
    return {
      likesCount: likes,
      dislikesCount: dislikes,
      myStatus: status,
      newestLikes:newPostsLikes
    } as postLikesInfo
  }

  async isPost(postId:number):Promise<boolean> {
    const post = await this.postModel.findByPk(postId)
    return !!post
  }
}