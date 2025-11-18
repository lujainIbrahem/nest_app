import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { BrandModel, BrandRepo, CategoryModel, CategoryRepo, UserModel, UserRepo } from '../Db';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports:[UserModel,BrandModel,CategoryModel],
  providers: [CategoryService,TokenService,JwtService,UserRepo,BrandRepo,CategoryRepo],
  controllers: [CategoryController],
})
export class CategoryModule {}
