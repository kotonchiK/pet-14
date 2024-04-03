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
