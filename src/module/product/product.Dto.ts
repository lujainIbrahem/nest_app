import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common";

export class createProductDTO{

    @IsString({message:"name must be string"})
    @IsNotEmpty({message:"name is required"})
    @Length(3, 50, { message: "name must be between 3 to 50 characters" })
    name:string

    @IsString({message:"description must be string"})
    @IsNotEmpty({message:"description is required"})
    @MinLength(1)
    @MaxLength(100000)
    description:string

    @IsNumber()
    @IsNotEmpty({message:"price is required"})
    @Type(()=>Number)
    price:number

    @IsNumber()
    @IsOptional()
    @Type(()=>Number)
    @Min(1)
    @Max(100)
    discount?:number

    @IsNumber()
    @Type(()=>Number)
    @Min(1)
    @IsNotEmpty()
    quantity:number

    @IsNumber()
    @Type(()=>Number)
    @Min(1)
    @IsNotEmpty()
    stock:number

    @IsNotEmpty()
    @IsMongoId()
    brand:Types.ObjectId  
    
    @IsNotEmpty()
    @IsMongoId()
    Category:Types.ObjectId 
    
    @IsNotEmpty()
    @IsMongoId()
    subCategory:Types.ObjectId    
}

@AtLeastOne(["name","description","stock","quantity","price","discount","Category","brand","subCategory"])
export class updateProductDTO extends PartialType(createProductDTO){}

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