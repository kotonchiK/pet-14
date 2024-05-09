import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from "@nestjs/common";
@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new NotFoundException('Invalid id parameter');
    }
    return value;
  }
}
