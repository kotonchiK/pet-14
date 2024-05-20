import { BadRequestException, Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { BlogsQueryRepository } from "../../features/blogs/infrastructure/blogs.query.repository";
import {
  BlogsQueryRepository_TYPEORM
} from "../../features/blogs/infrastructure/typeORM-repositories/blogs.query.repository";

@Injectable()
@ValidatorConstraint({ name: 'IsBlogExist', async: true })
export class IsBlogExist implements ValidatorConstraintInterface {
  constructor(private readonly repository: BlogsQueryRepository_TYPEORM) {}

  async validate(blogId: number, args: ValidationArguments):Promise<boolean> {
    return await this.repository.isBlog(blogId)
  }
  defaultMessage(args: ValidationArguments) {
    return 'Blog validation failed';
  }
}