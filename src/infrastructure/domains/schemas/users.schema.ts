import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop(
    {required:true}
  )
  login:string

  @Prop(
    {required:true}
  )
  email:string

  @Prop(
    {required:true}
  )
  createdAt:Date

}

export const UserSchema = SchemaFactory.createForClass(User)

export const UserFeature = {
  name:User.name,
  schema:UserSchema
}