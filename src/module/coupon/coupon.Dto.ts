
import {  IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, Max, MaxLength, Min, MinLength, Validate } from "class-validator";
import { CouponValidator } from "src/common/decorator/coupon.decorator";


export class createCouponDTO{

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    code:string

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    @IsPositive()
    amount:number

    @IsDateString()
    @IsNotEmpty()
    @Validate(CouponValidator)
    fromDate:Date

    @IsDateString()
    @IsNotEmpty()
    toDate:Date
}
