import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';

import { BrandModel, BrandRepo, CategoryModel, CategoryRepo,
   ProductModel, ProductRepo, subCategoryModel, 
   subCategoryRepo, UserModel, UserRepo } from '../Db';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports:[UserModel,ProductModel,BrandModel,CategoryModel,subCategoryModel],
  providers: [ProductService,TokenService,JwtService,UserRepo,ProductRepo,CategoryRepo,subCategoryRepo,BrandRepo,UserRepo],
  controllers: [ProductController]
})
export class ProductModule {}
