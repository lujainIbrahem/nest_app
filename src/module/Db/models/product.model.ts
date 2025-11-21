import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class Product {

  @Prop({type:String,required:true,minlength:2,maxLength:50,trim:true,unique:true})
   name: string;

  @Prop({type:String,default:function (){return slugify(this.name,{replacement:"-",lower:true,trim:true})}})
   slug: string;

  @Prop({type:String,required:true,minLength:1,maxLength:100000,trim:true})
   description: string;

  @Prop({type:String})
  minImage: string;

  @Prop([{type:[String]}])
  subImages: string;

  @Prop({type:Number, required:true})
  price: number;

  @Prop({type:Number, min:1 ,max:100})
  discount: number;

  @Prop({type:Number, min:1 })
  quantity: number;
  
  @Prop({type:Number })
  stock: number;

  @Prop({type:Number })
  rateNum: number;

  @Prop({type:Number })
  rateAvg: number;

  @Prop({type:Types.ObjectId,required:true, ref:"Brand"})
  brand: Types.ObjectId;

  @Prop({type:Types.ObjectId,required:true, ref:"Category"})
  Category: Types.ObjectId;

  @Prop({type:Types.ObjectId,required:true, ref:"subCategory"})
  subCategory: Types.ObjectId;  

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type:Date })
  deletedAt: Date;

  @Prop({type:Types.ObjectId, ref:"User"})
  updatedBy:Types.ObjectId;

  @Prop({type:Date})
  restoredAt: Date;
}

export type HProductDocument =HydratedDocument<Product>
export const ProductSchema = SchemaFactory.createForClass(Product);
 ProductSchema.pre(["updateOne","findOneAndUpdate"],async function (next) {
    const update = this.getUpdate() as UpdateQuery<Product> 
    if(update.name){
      update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
        next()
    })
  ProductSchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
  const query = this.getQuery()
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})
 
export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
 schema: ProductSchema
  }
])