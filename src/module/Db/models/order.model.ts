import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class Order {

  @Prop({type:Types.ObjectId , required:true , ref:"User"})
  userId: Types.ObjectId;

  @Prop({type:Types.ObjectId , required:true , ref:"Cart"})
  cart: Types.ObjectId;

  @Prop({type:Types.ObjectId ,ref:"Coupon"})
  coupon: Types.ObjectId;

  @Prop({type:Number , required:true})
   totalPrice: number;

  @Prop({type:String , required:true})
   phone: string;

  @Prop({type:String , required:true})
   address: string;

  @Prop({type:String , enum:paymentMethodEnum, default:paymentMethodEnum.CASH , required:true})
  paymentMethod: paymentMethodEnum;

  @Prop({type:String , enum:orderStatusEnum, required:true})
  status: orderStatusEnum;   

  @Prop({type:Date , default: Date.now() + 3 * 24 * 60 * 60 * 1000})
  arriveAt: Date;

  @Prop({type:String})
  paymentIntent: string;

  @Prop({type:{
    paidAt : Date,
    deliveredAt :Date,
    deliveredBy :{type:Types.ObjectId,ref:"User"},
    canceledAt :Date,
    canceledBy :{type:Types.ObjectId,ref:"User"},
    refundedAt :Date,
    refundedBy :{type:Types.ObjectId,ref:"User"},
    
  }})
  orderChanges: object;
}

export type HOrderDocument =HydratedDocument<Order>
export const OrderSchema = SchemaFactory.createForClass(Order);
 
export const OrderModel = MongooseModule.forFeature([
  {
  name: Order.name,
  schema: OrderSchema
  }
])