import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import type{ HUserDocument } from '../Db';
import { createCategoryDTO, idDTO, QueryDTO, updateCategoryDTO } from './category.Dto';
import { BrandRepo, CategoryRepo } from '../Db';

@Injectable()
export class CategoryService {
    constructor(
        private readonly CategoryRepo: CategoryRepo,
        private readonly brandRepo: BrandRepo,
        
    ){}
    
//=======================createCategory============================    
async createCategory(
    CategoryDTO:createCategoryDTO,
    user:HUserDocument
){
    const {name , slogan , brands} = CategoryDTO
const userExist = await this.CategoryRepo.findOne({ name })
    if (userExist) {
        throw new ConflictException('category name Category already exist');
    }
        const strictBrand= [... new Set(brands || [])]

    if (brands &&( await this.brandRepo.find({filter:{_id:{$in:strictBrand}}})).length != strictBrand.length){
    throw new ForbiddenException("brand not found")

    }
    const Category = await this.CategoryRepo.create({
        name,
        slogan,
        brands:strictBrand,
        createdBy:user._id
    })
    if(!Category){
    throw new ForbiddenException("Category not created")
    }
    return Category
}

    
 //=======================updateCategory============================   
async updateCategory(
    CategoryDTO:updateCategoryDTO,
    user:HUserDocument,
    id:Types.ObjectId
){
    let Category;
    const {name , slogan,brands} = CategoryDTO
 Category = await this.CategoryRepo.findOne({ 
    _id:id,
    createdBy:user._id
 })
    if (!Category) {
    throw new NotFoundException(' Category not found');
    }
    if(name && await this.CategoryRepo.findOne({name , createdBy:user._id})) 
    {
    throw new ConflictException('name already exist')
    }

    const strictBrand= [... new Set(brands || [])]

    if (brands &&( await this.brandRepo.find({filter:{_id:{$in:strictBrand}}})).length != strictBrand.length)
    {
    throw new ForbiddenException("brand not found")
    }

    if(slogan){Category.slogan= slogan}
    
     Category = await this.CategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , createdBy:user._id},
            update:{name,slogan,brands:strictBrand}
        }
    ) 
    return Category
    
}


//=======================freezeCategory============================
async freezeCategory(
    user:HUserDocument,
    id:Types.ObjectId
){

     const Category = await this.CategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:false}},
            update:{deletedAt:new Date(), updatedBy:user._id}
        }
    ) 
      if (!Category) {
        throw new NotFoundException(' Category not found or already freezed');
    }  
    return Category
    
}


//=======================restoredCategory============================
async restoredCategory(
    user:HUserDocument,
    id:Types.ObjectId
){

     const Category = await this.CategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
            update:{$unset:{deletedAt:""}, restoredAt:new Date(),updatedBy:user._id}
        }
    ) 
      if (!Category) {
        throw new NotFoundException(' Category already restored');
    }  
    return Category
    
}


//=======================deletedCategory============================
async deletedCategory(
    id:Types.ObjectId
){

     const Category = await this.CategoryRepo.findOneAndDelete(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
        }
    ) 
      if (!Category) {
        throw new NotFoundException(' Category already deleted');
    }  
    return Category
    
}


//=======================getAllCategorys============================
async getAllCategorys(query:QueryDTO){
    const {page=1 , limit=2 , search} = query 
    const {document , numberOfPages , cuttentPage ,countDocument} = await this.CategoryRepo.paginate(
    {
        filter:{
            ...(search ?{
            $or :[
                {name:{$regex : search,$options:"i"}},
                {slogan:{$regex : search,$options:"i"}}
            ]
        }:{})
        },
        query:{page,limit}
    })
    return {document , numberOfPages , cuttentPage ,countDocument}
    
}



}
