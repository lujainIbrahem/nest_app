import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { CouponModel, CouponRepo, UserModel, UserRepo } from '../Db';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';

@Module({
  imports:[UserModel,CouponModel],
  providers: [CouponService,TokenService,JwtService,UserRepo,CouponRepo],
  controllers: [CouponController]
})
export class CouponModule {}
