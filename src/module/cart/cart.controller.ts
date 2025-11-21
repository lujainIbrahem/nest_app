import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { createCartDTO, idDTO, updateCartDTO } from './cart.Dto';
import { CartService } from './cart.service';


@Controller('Carts')
export class CartController {
constructor(private readonly CartService :CartService){}


//=======================createCart============================

@Auth({
    roles:[UserRoleEnum.admin,UserRoleEnum.user],
    typeToken:UserTokenTypeEnum.access
})
@Post("createCart")
async createCart(
    @Body() body:createCartDTO,
    @User() user:HUserDocument
){
    const Cart = await this.CartService.createCart(body,user)
   return {message:"created done",Cart}
}


//=======================removeCart============================

@Auth({
roles:[UserRoleEnum.admin,UserRoleEnum.user],
typeToken:UserTokenTypeEnum.access
})
@Delete("removeCart/:id")
async removeCart(
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Cart = await this.CartService.removeCart( user ,params.id)
   return {message:"updated done",Cart}
}


//=======================updateQuantityCart============================

@Auth({
roles:[UserRoleEnum.admin,UserRoleEnum.user],
typeToken:UserTokenTypeEnum.access
})
@Patch("updateQuantityCart/:id")
async updateCart(
    @Body() body:updateCartDTO,
    @Param() params:idDTO,
    @User() user :HUserDocument,
){
   const Cart = await this.CartService.updateQuantityCart(body, user ,params.id)
   return {message:"updated done",Cart}
}






}
