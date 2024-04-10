import { BadRequestException, ValidationPipe } from "@nestjs/common";

const validationPipeConfig = {
  stopAtFirstError: false,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);
      constraintsKeys.forEach((ckey) => {
        errorsForResponse.push({
          message: e.constraints[ckey],
          field: e.property
        });
      });
    });
    throw new BadRequestException(errorsForResponse);
  }
};
export const globalValidationPipe = new ValidationPipe(validationPipeConfig);