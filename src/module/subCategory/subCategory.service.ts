import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepo } from '../Db';
import { createsubCategoryDTO, QueryDTO, updatesubCategoryDTO } from './subCategory.Dto';
import {  subCategoryRepo } from '../Db';
import type{  HUserDocument } from '../Db';

@Injectable()
export class subCategoryService {
    constructor(
        private readonly subCategoryRepo: subCategoryRepo,
        private readonly categoryRepo: CategoryRepo
        
    ){}
    
//=======================createsubCategory============================    
async createsubCategory(
    subCategoryDTO:createsubCategoryDTO,
    user:HUserDocument
){
    const {name , slogan , category} = subCategoryDTO
const userExist = await this.subCategoryRepo.findOne({ name })
    if (userExist) {
        throw new ConflictException('subCategory name already exist');
    }

if(category && !(await this.categoryRepo.findOne({_id: category}))) {
    throw new ForbiddenException("category not found");
}

    const subCategory = await this.subCategoryRepo.create({
        name,
        slogan,
        category,
        createdBy:user._id
    })
    if(!subCategory){
    throw new ForbiddenException("subCategory not created")
    }
    return subCategory
}

    
 //=======================updatesubCategory============================   
async updatesubCategory(
    subCategoryDTO:updatesubCategoryDTO,
    user:HUserDocument,
    id:Types.ObjectId
){
    let subCategory;
    const {name , slogan,category} = subCategoryDTO
 subCategory = await this.subCategoryRepo.findOne({ 
    _id:id,
    createdBy:user._id
 })
    if (!subCategory) {
    throw new NotFoundException(' subCategory not found');
    }
    if(name && await this.subCategoryRepo.findOne({name , createdBy:user._id})) 
    {
    throw new ConflictException('name already exist')
    }


if(category && !(await this.categoryRepo.findOne({_id: category}))) {
    throw new ForbiddenException("category not found");
}


    if(slogan){subCategory.slogan= slogan}
    
     subCategory = await this.subCategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , createdBy:user._id},
            update:{name,slogan,category}
        }
    ) 
    return subCategory
    
}


//=======================freezesubCategory============================
async freezesubCategory(
    user:HUserDocument,
    id:Types.ObjectId
){

     const subCategory = await this.subCategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:false}},
            update:{deletedAt:new Date(), updatedBy:user._id}
        }
    ) 
      if (!subCategory) {
        throw new NotFoundException(' subCategory not found or already freezed');
    }  
    return subCategory
    
}


//=======================restoredsubCategory============================
async restoredsubCategory(
    user:HUserDocument,
    id:Types.ObjectId
){

     const subCategory = await this.subCategoryRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
            update:{$unset:{deletedAt:""}, restoredAt:new Date(),updatedBy:user._id}
        }
    ) 
      if (!subCategory) {
        throw new NotFoundException(' subCategory already restored');
    }  
    return subCategory
    
}


//=======================deletedsubCategory============================
async deletedsubCategory(
    id:Types.ObjectId
){

     const subCategory = await this.subCategoryRepo.findOneAndDelete(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
        }
    ) 
      if (!subCategory) {
        throw new NotFoundException(' subCategory already deleted');
    }  
    return subCategory
    
}


//=======================getAllsubCategorys============================
async getAllsubCategorys(query:QueryDTO){
    const {page=1 , limit=2 , search} = query 
    const {document , numberOfPages , cuttentPage ,countDocument} = await this.subCategoryRepo.paginate(
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
