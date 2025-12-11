import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { OrderService } from './order.service';
import { createOrderDTO, idDTO } from './order.Dto';


@Controller('Orders')
export class OrderController {
constructor(private readonly Orderervice :OrderService){}


//=======================createOrder============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createOrder")
async createOrder(
    @Body() body:createOrderDTO,
    @User() user:HUserDocument
){
    const Order = await this.Orderervice.createOrder(body,user)
   return {message:"created done",Order}
}

//=======================paymentstripe============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("paymentstripe/:id")
async paymentstripe(
    @Param() params:idDTO,
    @User() user:HUserDocument
){
    const Order = await this.Orderervice.paymentstripe(user,params.id)
   return {message:"created done",Order}
}



//=======================webhook============================

@Post("webhook")
async webhook(
    @Body() body:any,
){
    const Order = await this.Orderervice.webhook(body)
   return {message:"created done",Order}}



   //=======================refundedOrder============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Patch("refundedOrder/:id")
async refundedOrder(
    @Param() params:idDTO,
    @User() user:HUserDocument
){
    const Order = await this.Orderervice.refundedOrder(user,params.id)
   return {message:"created done",Order}
}


}
