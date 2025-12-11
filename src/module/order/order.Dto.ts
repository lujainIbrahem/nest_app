import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne, paymentMethodEnum } from "src/common";

export class createOrderDTO{

    @IsString({message:"address must be string"})
    @IsNotEmpty({message:"address is required"})
    address:string

    @IsString()
    @IsNotEmpty()
    phone:string

    @IsEnum(paymentMethodEnum)
    paymentMethod:paymentMethodEnum

    @IsString()
    @IsOptional()
    couponCode?:string    

}

@AtLeastOne(["name","slogan"])
export class updateOrderDTO extends PartialType(createOrderDTO){}

export class idDTO{
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    id:Types.ObjectId
}


export class QueryDTO{

    @IsNumber()
    @IsOptional()
    @Type(()=>Number)
    page?:number

    @IsNumber()
    @IsOptional()
    @Type(()=>Number)
    limit?:number

    @IsString()
    @IsOptional()
    search?:string
}