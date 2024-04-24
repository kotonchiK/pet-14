import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { CommentsService } from "../application/comments.service";
import { OutputCommentModel } from "./models/output";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { CreateCommentDto } from "./models/input";
import { Request } from "express";
import { LikeStatusDto } from "../../../base/models/likeStatusDto";
import { CurrentUserIdPipe } from "../../../infrastructure/pipes/currentUserId.pipe";

@Controller('/comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService) {
  }

  @Get(':id')
  @UsePipes(CurrentUserIdPipe)
  async getCommentById(@Req() req: Request,
                       @Param('id', ValidateObjectId) id: string): Promise<OutputCommentModel> {
    return await this.commentsService.getCommentById(id, req.userId)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatedComment(
    @Req() req: Request,
    @Param('id', ValidateObjectId) id: string,
    @Body() dto: CreateCommentDto): Promise<void> {
    const userId = req.userId
    await this.commentsService.updateComment(id, userId, dto.content)
  }


  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Req() req: Request,
                      @Param('id', ValidateObjectId) id: string): Promise<void> {
    const userId = req.userId
    await this.commentsService.deleteComment(id, userId)
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setLikeStatus(@Req() req: Request,
                      @Param('id', ValidateObjectId) id: string,
                      @Body() status: LikeStatusDto): Promise<void> {
    {
      const dto = {
        id,
        userId: req.userId,
        status: status.likeStatus
      }
      await this.commentsService.setLikeStatus(dto)
    }
  }
}