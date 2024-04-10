import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { passwordChange, passwordChangeDocument } from "../domains/schemas/users.schema";

@Injectable()
export class PasswordChangeMiddleware implements NestMiddleware {
  constructor(@InjectModel(passwordChange.name) private readonly passwordChangeModel: Model<passwordChangeDocument>) {}

  async use(req: Request, res: Response, next: NextFunction) {

    const recoveryCode = req.body.recoveryCode;
    if (!recoveryCode) {
      throw new BadRequestException('Recovery code is required');
    }

    const isCode = await this.passwordChangeModel.findOne({"recoveryCode":recoveryCode}).lean();
    if (!isCode) {
      throw new BadRequestException('Invalid recovery code');
    }

    const currentDateTime = new Date();
    const expDate = new Date(isCode.expDate);
    if (currentDateTime > expDate) {
      throw new BadRequestException('Recovery code has expired');
    }

    next();
  }
}
