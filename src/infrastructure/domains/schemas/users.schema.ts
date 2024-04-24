import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

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

@Table({ tableName: 'users' })
export class UserTest extends Model<UserTest> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  login: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @ForeignKey(() => EmailConfirmationTest)
  @Column({ type: DataType.INTEGER })
  emailConfirmationId: number; // Внешний ключ к таблице email_confirmations
}

@Table({ tableName: 'email_confirmations' })
export class EmailConfirmationTest extends Model<EmailConfirmationTest> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false})
  confirmationCode: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expirationDate: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isConfirmed: boolean;
}

@Table({ tableName: 'tokens' })
export class TokensTest extends Model<TokensTest>{
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true })
  id: number;

  @ForeignKey(() => UserTest) // Устанавливаем внешний ключ к таблице пользователей
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false, unique:true})
  deviceId: string;

  @Column({ type: DataType.STRING, allowNull: false})
  ip: string;

  @Column({ type: DataType.STRING, allowNull: false})
  title: string;

  @Column({ type: DataType.DATE, allowNull: false })
  iat: Date;
}

@Table({ tableName: 'passwordChange' })
export class passwordChangeTest extends Model<passwordChangeTest> {
  @Column({ type: DataType.STRING, allowNull: false})
  email:string

  @Column({ type: DataType.STRING, allowNull: false})
  recoveryCode:string

  @Column({ type: DataType.DATE, allowNull: false })
  expDate: Date;

}