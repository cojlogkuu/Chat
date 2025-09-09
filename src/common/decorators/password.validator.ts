import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrong(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName,
      options: options,
      validator: {
        validate(value: string): boolean {
          const regex =
            /^[A-Z].*(\d).*([!@#$%^&*(),.?":{}|<>])|([!@#$%^&*(),.?":{}|<>]).*(\d).*$/;
          return regex.test(value);
        },
        defaultMessage(validationArguments: ValidationArguments): string {
          return `${validationArguments.property} must start with an uppercase letter, contain at least one number and one special character`;
        },
      },
    });
  };
}
