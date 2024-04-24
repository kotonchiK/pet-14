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
    throw new BadRequestException(removeDuplicateFields(errorsForResponse));
  }
};
export const globalValidationPipe = new ValidationPipe(validationPipeConfig);

interface ErrorMessage {
  message: string;
  field: string;
}

function removeDuplicateFields(errors: ErrorMessage[]): ErrorMessage[] {
  const errorMap = new Map<any, ErrorMessage>();

  // Заполнение Map значениями, используя поле field в качестве ключа
  for (const error of errors) {
    errorMap.set(error.field, error);
  }

  // Преобразование Map обратно в массив объектов ошибок
  return Array.from(errorMap.values());
}
