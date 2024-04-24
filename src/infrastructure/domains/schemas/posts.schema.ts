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

import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { BlogTest } from "./blogs.schema";
import { UserTest } from "./users.schema";

@Table({tableName:'posts'})
export class PostTest extends Model<PostTest> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique:true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title:string

  @Column({ type: DataType.STRING, allowNull: false })
  shortDescription:string

  @Column({ type: DataType.STRING, allowNull: false })
  content:string

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt:Date

  @Column({ type: DataType.STRING, allowNull: false })
  blogName:string

  @ForeignKey(() => BlogTest)
  @Column({ type: DataType.INTEGER })
  blogId: number;
}

@Table({tableName:'postsLikes'})
export class PostLikesTest extends Model<PostLikesTest> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique:true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  login:string

  @Column({
    type: DataType.ENUM('Like', 'Dislike', 'None'),
    allowNull: false,
    defaultValue: 'None'
  })
  status: string;

  @Column({ type: DataType.DATE, allowNull: false })
  addedAt:Date

  @ForeignKey(() => PostTest)
  @Column({ type: DataType.INTEGER })
  postId: number;

  @ForeignKey(() => UserTest)
  @Column({ type: DataType.INTEGER })
  userId: number;
}



