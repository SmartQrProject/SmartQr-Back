import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function EachLength(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'eachLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          return value.every((tag) => typeof tag === 'string' && tag.length >= min && tag.length <= max);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain strings between ${min} and ${max} characters`;
        },
      },
    });
  };
}
