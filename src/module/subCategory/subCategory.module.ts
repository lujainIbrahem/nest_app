import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { CategoryModel, CategoryRepo, subCategoryModel, subCategoryRepo, UserModel, UserRepo } from '../Db';
import { subCategoryService } from './subCategory.service';
import { subCategoryController } from './subCategory.controller';

@Module({
  imports: [ subCategoryModel,CategoryModel,UserModel],
  providers: [subCategoryService,subCategoryRepo,CategoryRepo,UserRepo, TokenService, JwtService ],
  controllers: [subCategoryController],
})
export class subCategoryModule {}
