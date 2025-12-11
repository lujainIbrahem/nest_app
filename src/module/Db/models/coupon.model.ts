import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class Coupon {

  @Prop({type:String,required:true,minlength:2,maxLength:50,trim:true,unique:true,lowercase:true})
   code: string;

  @Prop({type:Number,required:true})
   amount: number;

  @Prop({type:Date,required:true})
   fromDate: Date;

  @Prop({type:Date,required:true})
   toDate: Date;

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type :[{type:Types.ObjectId, ref:"User"}]})
  usedBy: Types.ObjectId[];

  @Prop({type:Date })
  deletedAt: Date;

  @Prop({type:Date})
  restoredAt: Date;
}

export type HCouponDocument =HydratedDocument<Coupon>
export const CouponSchema = SchemaFactory.createForClass(Coupon);

  CouponSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
  const query = this.getQuery()
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})
 
export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
 schema: CouponSchema
  }
])