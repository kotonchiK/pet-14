import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema()
export class Post {
  @Prop(
    {required:true}
  )
  title:string

  @Prop(
    {required:true}
  )
  shortDescription:string

  @Prop(
    {required:true}
  )
  content:string

  @Prop(
    {required:true}
  )
  createdAt:Date

  @Prop(
    {required:true}
  )
  blogId:string

  @Prop(
    {required:true}
  )
  blogName:string
}

export type PostDocument = HydratedDocument<Post>
export const PostSchema = SchemaFactory.createForClass(Post)

export const PostFeature = {
  name:Post.name,
  schema:PostSchema
}


@Schema()
export class PostLikes {
  @Prop(
    {required:true}
  )
  userId:string

  @Prop(
    {required:true}
  )
  postId:string

  @Prop(
    {required:true}
  )
  login:string

  @Prop(
    {required:true}
  )
  addedAt:Date

  @Prop(
    {required:true, default:'None', enum:['Like', 'Dislike', "None"]}
  )
  status:string
}

export type PostLikesDocument = HydratedDocument<PostLikes>
export const PostLikesSchema = SchemaFactory.createForClass(PostLikes)

export const PostLikesFeature = {
  name:PostLikes.name,
  schema:PostLikesSchema
}
