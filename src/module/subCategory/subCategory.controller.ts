import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { createsubCategoryDTO, idDTO, QueryDTO, updatesubCategoryDTO } from './subCategory.Dto';
import { subCategoryService } from './subCategory.service';


@Controller('subCategories')
export class subCategoryController {
constructor(private readonly subCategoryService :subCategoryService){}


//=======================createsubCategory============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createsubCategory")
async createsubCategory(
    @Body() subCategoryDTO:createsubCategoryDTO,
    @User() user:HUserDocument
){
    const subCategory = await this.subCategoryService.createsubCategory(subCategoryDTO,user)
   return {message:"created done",subCategory}
}


//=======================updatesubCategory============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("updatesubCategory/:id")
async updatesubCategory(
    @Param() params:idDTO,
    @Body() subCategoryDTO:updatesubCategoryDTO,
    @User() user :HUserDocument,
){
   const subCategory = await this.subCategoryService.updatesubCategory(subCategoryDTO , user ,params.id)
   return {message:"updated done",subCategory}
}


//=======================freezesubCategory===========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("freezesubCategory/:id")
async freezesubCategory(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const subCategory = await this.subCategoryService.freezesubCategory( user ,params.id)
   return {message:"freezed done",subCategory}
}
 

//=======================restoredsubCategory==========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("restoredsubCategory/:id")
async restoredsubCategory(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const subCategory = await this.subCategoryService.restoredsubCategory( user ,params.id)
   return {message:"restored done",subCategory}
}


//=======================deletedsubCategory============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Delete(":id")
async deletedsubCategory(
    @Param() params:idDTO,
){
   const subCategory = await this.subCategoryService.deletedsubCategory(params.id)
   return {message:"deleted done",subCategory}
}


//=======================getAllsubCategorys============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Get()
async getAllsubCategorys(
    @Query() query:QueryDTO,
){
   const subCategory = await this.subCategoryService.getAllsubCategorys(query)
   return {message:"done",subCategory}
}


}
