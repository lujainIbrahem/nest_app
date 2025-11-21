import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepo, CategoryRepo, subCategoryRepo } from '../Db';
import { Types } from 'mongoose';
import { ProductRepo } from '../Db';
import { createProductDTO, QueryDTO, updateProductDTO } from './product.Dto';
import type {  HUserDocument } from '../Db';


@Injectable()
export class ProductService {
    constructor(
        private readonly ProductRepo: ProductRepo,
        private readonly BrandRepo: BrandRepo,
        private readonly CategoryRepo: CategoryRepo,
        private readonly subCategoryRepo: subCategoryRepo,


    ){}
    
//=======================createProduct============================    
async createProduct(
    ProductDTO:createProductDTO,
    user:HUserDocument
){
    let {name,description,price,discount,quantity,stock,brand,Category,subCategory} = ProductDTO
    const brandExist = await this.BrandRepo.findOne({ _id:brand })
    if (!brandExist) {
        throw new NotFoundException('brand not found');
    }
    const categoryExist = await this.CategoryRepo.findOne({ _id:Category })
    if (!categoryExist) {
        throw new NotFoundException('Category not found');
    }
    const subCategoryExist = await this.subCategoryRepo.findOne({ _id:subCategory })
    if (!subCategoryExist) {
        throw new NotFoundException('subCategory not found');
    } 
    if (stock > quantity) {
        throw new BadRequestException('Not enough stock available');
    }
    price = price -(price * ((discount || 0) / 100))
    
    const Product = await this.ProductRepo.create({
        name,
        description,
        price,
        discount,
        quantity,
        stock,
        brand,
        Category,
        subCategory,
        createdBy:user._id
    })
    if(!Product){
    throw new ForbiddenException("Product not created")
    }
    return Product
}

    
 //=======================updateProduct============================   
async updateProduct(body:updateProductDTO,user:HUserDocument,id:Types.ObjectId){
    let Product;
    let {name,description,price,discount,quantity,stock,brand,Category,subCategory} = body
 Product = await this.ProductRepo.findOne({ 
    _id:id,
    createdBy:user._id
 })
    if (!Product) {
        throw new NotFoundException(' Product not found');
    }
    if(brand){
    const brandExist = await this.BrandRepo.findOne({ _id:brand })
    if (!brandExist) {
        throw new NotFoundException('brand not found');
    }        
    }
    if(Category){
    const categoryExist = await this.CategoryRepo.findOne({ _id:Category })
    if (!categoryExist) {
        throw new NotFoundException('Category not found');
    }        
    }
    if(subCategory){
    const subCategoryExist = await this.subCategoryRepo.findOne({ _id:subCategory })
    if (!subCategoryExist) {
        throw new NotFoundException('subCategory not found');
    }         
    }
    if(price&& discount){
    price = price -(price * ((discount) / 100)) 
    }
    else if(price){
    price = price -(price * ((Product.discount) / 100)) 
    }
    else if(discount){
    price = Product.price -(Product.price * ((discount) / 100)) 
    }

    if(stock){
    if (stock > Product.quantity ) {
        throw new BadRequestException('Not enough stock available');
    }         
    }

     Product = await this.ProductRepo.findOneAndUpdate(
        {
            filter:{_id:id ,createdBy:user._id},
            update:{
                ...body,
                price,
                discount,
                quantity,
                stock
            }
        }) 
    return Product
    
}

//=======================freezeProduct============================
async freezeProduct(user:HUserDocument,id:Types.ObjectId){
     const Product = await this.ProductRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:false}},
            update:{deletedAt:new Date(), updatedBy:user._id}
        }
    ) 
      if (!Product) {
        throw new NotFoundException(' Product not found or already freezed');
    }  
    return Product
    
}


//=======================restoredProduct============================
async restoredProduct(
    user:HUserDocument,
    id:Types.ObjectId
){

     const Product = await this.ProductRepo.findOneAndUpdate(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
            update:{$unset:{deletedAt:""}, restoredAt:new Date(),updatedBy:user._id}
        }
    ) 
      if (!Product) {
        throw new NotFoundException(' Product already restored');
    }  
    return Product
    
}


//=======================deletedProduct============================
async deletedProduct(
    id:Types.ObjectId
){

     const Product = await this.ProductRepo.findOneAndDelete(
        {
            filter:{_id:id , deletedAt:{$exists:true}, paranoid:false},
        }
    ) 
      if (!Product) {
        throw new NotFoundException(' Product already deleted');
    }  
    return Product
    
}


//=======================getAllProducts============================
async getAllProducts(query:QueryDTO){
    const {page=1 , limit=2 , search} = query 
    const {document , numberOfPages , cuttentPage ,countDocument} = await this.ProductRepo.paginate(
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
