import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import {createBrandDTO, idDTO, QueryDTO, updateBrandDTO } from './brand.Dto';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';


@Controller('brands')
export class BrandController {
constructor(private readonly brandService :BrandService){}


//=======================createBrand============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createBrand")
async createBrand(
    @Body() brandDTO:createBrandDTO,
    @User() user:HUserDocument
){
    const brand = await this.brandService.createBrand(brandDTO,user)
   return {message:"created done",brand}
}


//=======================updateBrand============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("updateBrand/:id")
async updateBrand(
    @Param() params:idDTO,
    @Body() brandDTO:updateBrandDTO,
    @User() user :HUserDocument,
){
   const brand = await this.brandService.updateBrand(brandDTO , user ,params.id)
   return {message:"updated done",brand}
}


//=======================freezeBrand===========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("freezeBrand/:id")
async freezeBrand(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const brand = await this.brandService.freezeBrand( user ,params.id)
   return {message:"freezed done",brand}
}
 

//=======================restoredBrand==========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("restoredBrand/:id")
async restoredBrand(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const brand = await this.brandService.restoredBrand( user ,params.id)
   return {message:"restored done",brand}
}


//=======================deletedBrand============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Delete(":id")
async deletedBrand(
    @Param() params:idDTO,
){
   const brand = await this.brandService.deletedBrand(params.id)
   return {message:"deleted done",brand}
}


//=======================getAllBrands============================
@Get()
async getAllBrands(
    @Query() query:QueryDTO,
){
   const brand = await this.brandService.getAllBrands(query)
   return {message:"done",brand}
}


}
