import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { BrandModel, BrandRepo, UserModel, UserRepo } from '../Db';

@Module({
  imports:[UserModel,BrandModel],
  providers: [BrandService,TokenService,JwtService,UserRepo,BrandRepo],
  controllers: [BrandController]
})
export class BrandModule {}
