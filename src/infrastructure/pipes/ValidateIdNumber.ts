import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException, BadRequestException } from "@nestjs/common";
@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(value)) {
      throw new BadRequestException('Invalid id parameter');
    }
    // } else if (value === null || value === undefined || isNaN(value)) {
    //   throw new NotFoundException('Invalid id parameter');
    // }
    return value;
  }
}
