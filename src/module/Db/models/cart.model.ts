import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})
export class productCart {

  @Prop({type:Types.ObjectId,required:true, ref:"Product"})
  productId: Types.ObjectId;

  @Prop({type:Number, required:true})
  finalPrice: number;

  @Prop({type:Number,required:true })
  quantity: number; 

}

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})
export class Cart {

  @Prop({type:[productCart]})
   products: productCart[];

  @Prop({type:[String]})
  subImages: string;

  @Prop({type:Number})
  subTotal: number; 

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type:Date })
  deletedAt: Date;

  @Prop({type:Types.ObjectId, ref:"User"})
  updatedBy:Types.ObjectId;

  @Prop({type:Date})
  restoredAt: Date;
}

export type HCartDocument =HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart)
 CartSchema.pre("save", function (next) {
   this.subTotal = this.products.reduce((total,product) => total + (product.quantity *product.finalPrice),0) 
        next()
    })

  CartSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
  const query = this.getQuery()
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})
 
export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
 schema: CartSchema
  }
])