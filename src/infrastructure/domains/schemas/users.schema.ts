import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true, default:false })
  isConfirmed: boolean;
}


export type TokensDocument = HydratedDocument<Tokens>;

@Schema()
export class Tokens {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  iat: Date;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);

export const TokensFeature = {
  name:Tokens.name,
  schema:TokensSchema
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: EmailConfirmation, required: true })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User)

export const UserFeature = {
  name:User.name,
  schema:UserSchema
}

export type passwordChangeDocument = HydratedDocument<passwordChange>;

@Schema()
export class passwordChange {
  @Prop({required:true})
  email:string

  @Prop({required:true})
  recoveryCode:string

  @Prop({ required: true })
  expDate: Date;

}

export const passwordChangeSchema = SchemaFactory.createForClass(passwordChange)

export const passwordChangeFeature = {
  name:passwordChange.name,
  schema:passwordChangeSchema
}

