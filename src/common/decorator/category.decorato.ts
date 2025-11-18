import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { Types } from "mongoose";



@ValidatorConstraint({ name: "IdsMongo", async: false })
export class IdsMongo implements ValidatorConstraintInterface {

    validate(Ids: string[], args: ValidationArguments) {
        return Ids.filter(id => Types.ObjectId.isValid(id)).length === Ids.length; 
    }

    defaultMessage(args: ValidationArguments) {
        return 'ids not valid';
    }

}

@ValidatorConstraint({ name: "IdCategory", async: false })
export class IdCategory implements ValidatorConstraintInterface {

    validate(id: string) {
        return Types.ObjectId.isValid(id);
    }

    defaultMessage() {
        return 'category id not valid';
    }
}
