import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "CouponValidator", async: false })
export class CouponValidator implements ValidatorConstraintInterface {

    validate(value: string, args: ValidationArguments) {
        const obj = args.object as any
        const fromDate = new Date(obj.fromDate)
        const toDate = new Date(obj.toDate)
        const now = new Date

        return fromDate>=now && fromDate<toDate
    }

    defaultMessage(args: ValidationArguments) {
        return `fromDate should be greater than or equal now and smaller than toDate`;
    }

}