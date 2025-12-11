import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';
import { CouponService } from './coupon.service';
import { createCouponDTO } from './coupon.Dto';
import { idDTO } from '../cart/cart.Dto';


@Controller('Coupons')
export class CouponController {
constructor(private readonly CouponService :CouponService){}


//=======================createCoupon============================
@Auth({
    roles:[UserRoleEnum.admin],
    typeToken:UserTokenTypeEnum.access
})
@Post("createCoupon")
async createCoupon(
    @Body() CouponDTO:createCouponDTO,
    @User() user:HUserDocument
){
    const Coupon = await this.CouponService.createCoupon(CouponDTO,user)
   return {message:"created done",Coupon}
}

}
