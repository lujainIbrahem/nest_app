import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { createProductDTO, idDTO, QueryDTO, updateProductDTO } from './product.Dto';
import { ProductService } from './product.service';


@Controller('Products')
export class ProductController {
constructor(private readonly ProductService :ProductService){}


//=======================createProduct============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createProduct")
async createProduct(
    @Body() ProductDTO:createProductDTO,
    @User() user:HUserDocument
){
    const Product = await this.ProductService.createProduct(ProductDTO,user)
   return {message:"created done",Product}
}


//=======================updateProduct============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Put("updateProduct/:id")
async updateProduct(
    @Param() params:idDTO,
    @Body() body:updateProductDTO,
    @User() user :HUserDocument,
){
   const Product = await this.ProductService.updateProduct(body , user ,params.id)
   return {message:"updated done",Product}
}


//=======================freezeProduct===========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("freezeProduct/:id")
async freezeProduct(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Product = await this.ProductService.freezeProduct( user ,params.id)
   return {message:"freezed done",Product}
}
 

//=======================restoredProduct==========================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Patch("restoredProduct/:id")
async restoredProduct(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Product = await this.ProductService.restoredProduct( user ,params.id)
   return {message:"restored done",Product}
}


//=======================deletedProduct============================
@Auth({
roles:[UserRoleEnum.admin],
typeToken:UserTokenTypeEnum.access
})
@Delete(":id")
async deletedProduct(
    @Param() params:idDTO,
){
   const Product = await this.ProductService.deletedProduct(params.id)
   return {message:"deleted done",Product}
}


//=======================getAllProducts============================
@Get()
async getAllProducts(
    @Query() query:QueryDTO,
){
   const Product = await this.ProductService.getAllProducts(query)
   return {message:"done",Product}
}

//=======================wishList==========================
@Auth({
roles:[UserRoleEnum.admin,UserRoleEnum.user],
typeToken:UserTokenTypeEnum.access
})
@Post("wishList/:id")
async wishList(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const userExist = await this.ProductService.wishList( user ,params.id)
   return {message:"wishlist done",user:userExist}
}


}
