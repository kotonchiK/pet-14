import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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
