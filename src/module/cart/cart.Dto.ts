import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";

export class updateCartDTO{

    @IsNumber()
    @Type(()=>Number)
    @Min(1)
    @IsNotEmpty()
    quantity:number   

}
export class createCartDTO extends updateCartDTO{

    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    productId:Types.ObjectId

}

export class idDTO{
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    id:Types.ObjectId
}
