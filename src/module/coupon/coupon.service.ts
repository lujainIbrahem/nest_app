import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { HUserDocument } from '../Db';
import { Types } from 'mongoose';
import { CouponRepo } from '../Db';
import { createCouponDTO } from './coupon.Dto';

@Injectable()
export class CouponService {
    constructor(
        private readonly CouponRepo: CouponRepo,
    ){}
    
//=======================createCoupon============================    
async createCoupon(
    CouponDTO:createCouponDTO,
    user:HUserDocument
){
    const {code , amount,fromDate,toDate} = CouponDTO
const couponExist = await this.CouponRepo.findOne({ code:code.toLowerCase() })
    if (couponExist) {
        throw new ConflictException('code Coupon already exist');
    }
   
    const Coupon = await this.CouponRepo.create({
        code,
        amount,
        toDate,
        fromDate,
        createdBy:user._id
    })
    if(!Coupon){
    throw new ForbiddenException("Coupon not created")
    }
    return Coupon
}

 


}
