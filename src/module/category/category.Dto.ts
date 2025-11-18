import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorator/brand.decorator";
import { IdsMongo } from "src/common/decorator/category.decorato";

export class createCategoryDTO{

    @IsString({message:"name must be string"})
    @IsNotEmpty({message:"name is required"})
    @Length(3, 50, { message: "name must be between 3 to 50 characters" })
    name:string

    @IsString({message:"slogan must be string"})
    @IsNotEmpty({message:"slogan is required"})
    @Length(3, 30, { message: "slogan must be between 3 to 30 characters" })
    slogan:string

    @IsOptional()
    @Validate(IdsMongo)
    brands:Types.ObjectId[]
}

@AtLeastOne(["name","slogan","brands"])
export class updateCategoryDTO extends PartialType(createCategoryDTO){}

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