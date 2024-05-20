import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { UserTest } from "./users.schema";
import { PostTest } from "./posts.schema";
@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true })
  postId: string;

  @Prop({
    required: true,
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({
    required: true,
    type: [
      {
        userId: { type: String, required: true },
        status: { type: String, enum: ['Like', 'Dislike', 'None'], default: 'None', required: true },
      },
    ],
  })
  usersLikes: {
    userId: string;
    status: 'Like' | 'Dislike' | 'None';
  }[];
}
export type CommentDocument = HydratedDocument<Comment>
export const CommentSchema = SchemaFactory.createForClass(Comment)

export const CommentFeature = {
  name:Comment.name,
  schema:CommentSchema
}

@Table({tableName:'comments'})
export class CommentTest extends Model<CommentTest> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique:true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  content: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  postId: number;

  // TODO разделить
  @Column({ type: DataType.JSON, allowNull: false })
  commentatorInfo: {
    userId: number;
    userLogin: string;
  };
}

@Table({tableName:'commentsLikes'})
export class CommentsLikes extends Model<CommentsLikes> {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique:true })
  id: number;

  @Column({
    type: DataType.ENUM('Like', 'Dislike', 'None'),
    allowNull: false,
    defaultValue: 'None'
  })
  status: string;

  @ForeignKey(() => CommentTest)
  @Column({ type: DataType.INTEGER })
  commentId: number;

  @ForeignKey(() => UserTest)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
