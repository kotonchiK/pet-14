import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Column, DataType, Model, Table } from "sequelize-typescript";
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

  @Column({ type: DataType.JSON, allowNull: false })
  commentatorInfo: {
    userId: number;
    userLogin: string;
  };

  @Column({ type: DataType.JSON, allowNull: false })
  usersLikes: {
    userId: number;
    status: 'Like' | 'Dislike' | 'None';
  }[];
}
