import { StripeService } from './../../common/service/stripe.service';
import  { CartRepo, CouponRepo, OrderRepo, ProductRepo } from '../Db';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { HUserDocument } from '../Db';
import { Types } from 'mongoose';
import { createOrderDTO } from './order.Dto';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';

@Injectable()
export class OrderService {
constructor(
    private readonly OrderRepo: OrderRepo,
    private readonly CartRepo: CartRepo,
    private readonly CouponRepo: CouponRepo,
    private readonly ProductRepo: ProductRepo, 
    private readonly StripeService: StripeService,

){}
    
//=======================createOrder============================

async createOrder(
    body:createOrderDTO,
    user:HUserDocument
){
    const {phone, address, paymentMethod,couponCode} = body
    let coupon: any    
    if(couponCode){
    coupon = await this.CouponRepo.findOne({ code : couponCode , usedBy:{ $ne :[user._id]} })  
    if(!coupon){
    throw new NotFoundException("coupon not found")
    }
    }

    const cart = await this.CartRepo.findOne({createdBy:user._id})
    if( !cart || !cart.products.length ){
        throw new BadRequestException("cart not found")
    }

    for(const product of cart.products){
        const productData = await this.ProductRepo.findOne({
            _id:product.productId,
            stock:{$gte:product.quantity}
        })
        if(!productData){
        throw new BadRequestException("product not found")
        }
    }

    const order = await this.OrderRepo.create({
        userId:user._id,
        phone,
        address,
        paymentMethod,
        status:paymentMethod===paymentMethodEnum.CASH? orderStatusEnum.PLACED : orderStatusEnum.PENDING,
        coupon: couponCode ? coupon._id : undefined,
        totalPrice:couponCode ? cart.subTotal - (cart.subTotal * (coupon.amount / 100)):cart.subTotal,
        cart: cart._id,
    })

    for(const product of cart.products){
        await this.ProductRepo.findOneAndUpdate({
        filter:{  _id:product.productId},
        update:{
        $inc:{
        stock:-product.quantity
        }
    }
    })
    }
    if(coupon){
       await this.CouponRepo.findOneAndUpdate({
          filter:{  _id:coupon._id},
          update:{
        $push:{
            usedBy:user._id
        }
    }
    })
}
if(paymentMethod == paymentMethodEnum.CASH){
 await this.CartRepo.findOneAndUpdate({
          filter:{  _id:cart._id},
          update:{
            products:[]
    }
    })}

    return order
}


 //=======================paymentstripe============================   
async paymentstripe(
    user:HUserDocument,
    id:Types.ObjectId
){
 const order = await this.OrderRepo.findOne(
  { 
    _id: id,
    status: orderStatusEnum.PENDING
  },
  undefined,  
  {
    populate: [
      {
        path: "cart",
        populate: {
          path: "products.productId"
        }
      },
      {
        path: "coupon"
      }
    ]
  }
)

    if (!order) {
        throw new NotFoundException(' Order not found');
    }
    let coupon:any
    if(order.coupon){
        coupon = await this.StripeService.createCoupon({
            percent_off:(order.coupon as any).amount
        })

    }
    const {url}= await this.StripeService.createCheckOutSession({
    customer_email:user.email,
    metadata:{
        orderId:order._id.toString()
    },
    line_items:order.cart["products"].map((product:any)=>{
        return{
            price_data:{
                currency:'EGP',
                product_data :{
                    name:product.productId.name
                },
                unit_amount:product.finalPrice*100
            },
            quantity:product.quantity
        }
    }),
    discounts:coupon? [{coupon:coupon.id}]:[]

    })
    return {url}
    
}    


 //=======================webhook============================   
async webhook(body:any){
    const orderId= body.data.object.metadata.orderId
    const order = await this.OrderRepo.findOneAndUpdate({
        filter:{
            _id:orderId
        },update:{
            status:orderStatusEnum.PAID,
            orderChanges:{paidAt:new Date()},
            paymentIntent:body.data.object.payment_intent

        }
    })
    return order
}    


 //=======================refundedOrder============================   
async refundedOrder(
    user:HUserDocument,
    id:Types.ObjectId
){
let order = await this.OrderRepo.findOneAndUpdate({
    filter:{ _id:id,status:{$in:[orderStatusEnum.PENDING,orderStatusEnum.PLACED]} },
        update:{
            status:orderStatusEnum.CANCELED,
            orderChanges:{
                canceledAt:new Date(),
                canceledBy:user._id
            }
        }

})

 if (!order) {
        throw new NotFoundException(' Order not found');
    }

    if(order.paymentMethod == paymentMethodEnum.CARD)
        await this.StripeService.createRefoundPayment({
       payment_intent:order.paymentIntent
})
 order = await this.OrderRepo.findOneAndUpdate({
    filter:{ _id:id },
        update:{
            status:orderStatusEnum.REFUNDED,
            orderChanges:{
                canceledAt:new Date(),
                canceledBy:user._id
            }
        }

})




}  


}
