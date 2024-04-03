import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../../../infrastructure/domains/schemas/comments.schema";

export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel:Model<CommentDocument>) {}

}