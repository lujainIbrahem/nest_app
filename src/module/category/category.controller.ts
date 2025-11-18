import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { CategoryService } from './category.service';
import { createCategoryDTO, idDTO, QueryDTO, updateCategoryDTO } from './category.Dto';


@Controller('categories')
export class CategoryController {
constructor(private readonly CategoryService :CategoryService){}


//=======================createCategory============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createCategory")
async createCategory(
    @Body() CategoryDTO:createCategoryDTO,
    @User() user:HUserDocument
){
    const Category = await this.CategoryService.createCategory(CategoryDTO,user)
   return {message:"created done",Category}
}


//=======================updateCategory============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("updateCategory/:id")
async updateCategory(
    @Param() params:idDTO,
    @Body() CategoryDTO:updateCategoryDTO,
    @User() user :HUserDocument,
){
   const Category = await this.CategoryService.updateCategory(CategoryDTO , user ,params.id)
   return {message:"updated done",Category}
}


//=======================freezeCategory===========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("freezeCategory/:id")
async freezeCategory(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Category = await this.CategoryService.freezeCategory( user ,params.id)
   return {message:"freezed done",Category}
}
 

//=======================restoredCategory==========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("restoredCategory/:id")
async restoredCategory(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Category = await this.CategoryService.restoredCategory( user ,params.id)
   return {message:"restored done",Category}
}


//=======================deletedCategory============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Delete(":id")
async deletedCategory(
    @Param() params:idDTO,
){
   const Category = await this.CategoryService.deletedCategory(params.id)
   return {message:"deleted done",Category}
}


//=======================getAllCategorys============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Get()
async getAllCategorys(
    @Query() query:QueryDTO,
){
   const Category = await this.CategoryService.getAllCategorys(query)
   return {message:"done",Category}
}


}
