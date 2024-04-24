import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BlogDocument = HydratedDocument<Blog>

@Schema()
export class Blog {
  @Prop(
    {required:true}
  )
  name:string

  @Prop(
    {required:true}
  )
  description:string

  @Prop(
    {required:true}
  )
  websiteUrl:string

  @Prop(
    {required:true}
  )
  createdAt:Date

  @Prop(
    {required:true}
  )
  isMembership:boolean
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

export const BlogFeature = {
  name:Blog.name,
  schema:BlogSchema
}


import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table({tableName:'blogs'})
export class BlogTest extends Model<BlogTest> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique:true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  websiteUrl: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isMembership: boolean;
}

