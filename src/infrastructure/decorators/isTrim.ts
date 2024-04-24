import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTrim(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isTrim',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return value.trim() === value;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain leading or trailing spaces`;
        },
      },
    });
  };
}
