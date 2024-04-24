import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
@Injectable()
export class ValidateObjectId implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      throw new NotFoundException('Invalid ObjectId')
    }
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      throw new NotFoundException('Invalid ObjectId');
    }
    return value;
  }

}