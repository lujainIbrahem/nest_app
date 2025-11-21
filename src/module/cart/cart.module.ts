import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel, UserRepo, ProductRepo, ProductModel, CartModel, CartRepo } from '../Db';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
@Module({
  imports:[UserModel,CartModel,ProductModel],
  providers: [CartService,TokenService,JwtService,UserRepo,CartRepo,ProductRepo],
  controllers: [CartController]
})
export class CartModule {}
