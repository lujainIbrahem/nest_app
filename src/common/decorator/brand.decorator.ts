import { ValidationArguments} from "class-validator";
import {  registerDecorator, ValidationOptions } from "class-validator"

export function AtLeastOne(RequiredFields:string[], validationOptions?: ValidationOptions) {
   return function (constructor: Function) {
    registerDecorator({
    target:constructor,
    propertyName: "",
    options: validationOptions,
    constraints:RequiredFields,
    validator: {
    validate(value: string, args: ValidationArguments) {
    return RequiredFields.some(field => args.object[field]); 
    },
    defaultMessage(args: ValidationArguments) {
      return `At least one field is missing`;
    }
  }
  });
  };
}

