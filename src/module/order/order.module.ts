import { UserModel } from './../Db/models/user.model';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { CartModel, CartRepo, CouponModel, CouponRepo, OrderModel, OrderRepo, ProductModel, ProductRepo, UserRepo } from '../Db';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StripeService } from 'src/common';

@Module({
  imports:[UserModel,OrderModel,ProductModel,CartModel,CouponModel],
  providers: [OrderService,TokenService,JwtService,UserRepo,OrderRepo,ProductRepo,CouponRepo,CartRepo,StripeService],
  controllers: [OrderController]
})
export class OrderModule {}
