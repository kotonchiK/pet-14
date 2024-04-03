import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputPostModel, postLikesInfo } from "../api/models/output";
import { Post, PostDocument, PostLikes } from "../../../infrastructure/domains/schemas/posts.schema";
import { postMapper } from "../../../infrastructure/mappers/posts.mapper";
import { PostQueryModel } from "../api/models/input";

export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel:Model<PostDocument>,
              @InjectModel(PostLikes.name) private postLikesModel:Model<PostLikes>) {}

  async getPostById(postId:string, userId:string):Promise<OutputPostModel> {
    const post = await this.postModel.findById(new ObjectId(postId))

    const likesInfo = await this.postLikesInfo(postId, userId)

    return postMapper(post, likesInfo)
  }

  async getAllPosts(sortData:PostQueryModel, userId:string):Promise<Pagination<OutputPostModel>> {
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {}
    const posts = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
    const totalCount = await this.postModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    let sortPost:OutputPostModel[] = []
    for(let i:number = 0; i < posts.length; i++){
      const post = posts[i]
      const postLikesInfo:postLikesInfo = await this.postLikesInfo(post._id.toString(), userId)
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

  async getPostsForBlog(sortData:PostQueryModel, userId:string, blogId:string):Promise<Pagination<OutputPostModel>> {
    const {sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {blogId:blogId}
    const posts = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
    const totalCount = await this.postModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    let sortPost:OutputPostModel[] = []
    for(let i:number = 0; i < posts.length; i++){
      const post = posts[i]
      const postLikesInfo:postLikesInfo = await this.postLikesInfo(post._id.toString(), userId)
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

  async postLikesInfo(postId: string, userId: string):Promise<postLikesInfo> {
    const likesArray = await this.postLikesModel.find({postId:postId}).lean()
    if(likesArray.length === 0) {
      return {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes:[]
      }
    }
    const isUserId: string[] = userId.split('')
    let status = "None"

    if(isUserId.length > 1) {
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
          userId:sortedPost2[i].userId,
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

  async isPost(postId:string):Promise<boolean> {
    const post = await this.postModel.findById(new ObjectId(postId))
    return !!post
  }

}