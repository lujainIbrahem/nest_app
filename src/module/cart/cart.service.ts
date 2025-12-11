import { ProductRepo } from './../Db/repositories/product.repo';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from '../Db';
import { createCartDTO, updateCartDTO } from './cart.Dto';
import type {  HUserDocument } from '../Db';


@Injectable()
export class CartService {
    constructor(
        private readonly CartRepo: CartRepo,
        private readonly ProductRepo: ProductRepo
    ){}
    
//=======================createCart============================    
async createCart(
    body:createCartDTO,
    user:HUserDocument
){
    const {productId,quantity} = body
 const product = await this.ProductRepo.findOne({ 
    _id:productId,
    stock:{$gte:quantity}
  })
    if (!product) {
    throw new NotFoundException('product not found');
    }
    const cart = await this.CartRepo.findOne({
        createdBy:user._id
    })
    if(!cart){
        const newCart = await this.CartRepo.create({
            createdBy:user._id,
            products:[
                {
                    productId,
                    quantity,
                    finalPrice:product.price
                }
            ]
        })
        return newCart
    }
    const productCart= cart.products.find((product)=>product.productId.toString()=== productId.toString())
    if (productCart) {
    throw new BadRequestException('product already in cart');
    }
    cart.products.push({
        productId,
        quantity,
        finalPrice:product.price
    })
    await cart.save()
    return cart
}

//=======================removeCart============================    
async removeCart(user:HUserDocument,id:Types.ObjectId){
 const product = await this.ProductRepo.findOne({ _id:id})
    if (!product) {
    throw new NotFoundException('product not found');
    }
    const cart = await this.CartRepo.findOne({
        createdBy:user._id,
        "products.productId":id
    })
    if(!cart){
        throw new NotFoundException('cart not found');   
    }
cart.products = cart.products.filter((product) => product.productId.toString() !== id.toString())
    await cart.save()
    return cart
}


//=======================updateQuantityCart============================    
async updateQuantityCart(body:updateCartDTO,user:HUserDocument,id:Types.ObjectId){
    const {quantity} =body
    const cart = await this.CartRepo.findOne({
        createdBy:user._id,
        "products.productId":id
    })
    if(!cart){
        throw new NotFoundException('cart not found');   
    }
   cart.products.find((product)=>{
    if(product.productId.toString()=== id.toString()){
        product.quantity=quantity
        return product
    }

   })
    await cart.save()
    return cart

}

//=======================clearCart============================    
async clearCart(user:HUserDocument){
    const cart = await this.CartRepo.findOneAndUpdate({
        filter:{createdBy:user._id},
        update:{
         $set: { products: [] } 
        }
    })
    if(!cart){
        throw new NotFoundException('cart not found');   
    }
  
    await cart.save()
    return cart

}

}
