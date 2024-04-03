import { Controller, Get, Param} from "@nestjs/common";
import { CommentsService } from "../application/comments.service";
import {  OutputCommentModel } from "./models/output";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";

@Controller('/comments')
export class CommentsController {
  constructor(
    private commentsService:CommentsService) {}
  @Get(':id')
  async getCommentById(@Param('id', ValidateObjectId) id:string):Promise<OutputCommentModel>{
    return await this.commentsService.getCommentById(id, '')
  }
}

