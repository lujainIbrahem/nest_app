import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createBrandDTO, idDTO, QueryDTO, updateBrandDTO } from './brand.Dto';
import type { HUserDocument } from '../Db';
import { Types } from 'mongoose';
import { BrandRepo } from '../Db';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo: BrandRepo,
    ){}
    
//=======================createBrand============================    
async createBrand(
    brandDTO:createBrandDTO,
    user:HUserDocument
){
    const {name , slogan} = brandDTO
const userExist = await this.brandRepo.findOne({ name })
    if (userExist) {
        throw new ConflictException('name brand already exist');
    }
    const brand = await this.brandRepo.create({
        name,
        slogan,
        createdBy:user._id
    })
    if(!brand){
    throw new ForbiddenException("brand not created")
    }
    return brand
}

    
 //=======================updateBrand============================   
async updateBrand(
    brandDTO:updateBrandDTO,
    user:HUserDocument,
    id:Types.ObjectId
){
    let brand;
    const {name , slogan} = brandDTO
 brand = await this.brandRepo.findOne({ 
    _id:id,
    createdBy:user._id
 })
    if (!brand) {
        throw new NotFoundException(' brand not found');
    }
    if(name && await this.brandRepo.findOne({name , createdBy:user._id})) 
    { throw new ConflictException('name already exist');}  
    if(slogan){brand.slogan= slogan}
     brand = await this.brandRepo.findOneAndUpdate(
        {
            filter:{_id:id , createdBy:user._id},
            update:{name,slogan}
        }
    ) 
    return brand
    
}


//=======================freezeBrand============================
async freezeBrand(
    user:HUserDocument,
    id:Types.ObjectId
){

     const brand = await this.brandRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:false}},
            update:{deletedAt:new Date(), updatedBy:user._id}
        }
    ) 
      if (!brand) {
        throw new NotFoundException(' brand not found or already freezed');
    }  
    return brand
    
}


//=======================restoredBrand============================
async restoredBrand(
    user:HUserDocument,
    id:Types.ObjectId
){

     const brand = await this.brandRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
            update:{$unset:{deletedAt:""}, restoredAt:new Date(),updatedBy:user._id}
        }
    ) 
      if (!brand) {
        throw new NotFoundException(' brand already restored');
    }  
    return brand
    
}


//=======================deletedBrand============================
async deletedBrand(
    id:Types.ObjectId
){

     const brand = await this.brandRepo.findOneAndDelete(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
        }
    ) 
      if (!brand) {
        throw new NotFoundException(' brand already deleted');
    }  
    return brand
    
}


//=======================getAllBrands============================
async getAllBrands(query:QueryDTO){
    const {page=1 , limit=2 , search} = query 
    const {document , numberOfPages , cuttentPage ,countDocument} = await this.brandRepo.paginate(
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
