import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class subCategory {
  @Prop({type:String,required:true,minlength:2,maxLength:50,trim:true,unique:true})
   name: string;

  @Prop({type:String,required:true,minlength:2,maxLength:30,trim:true})
   slogan: string;

  @Prop({type:String,default:function (){return slugify(this.name,{replacement:"-",lower:true,trim:true})}})
   slug: string;

  @Prop({type:String})
  image: string;

  @Prop({type:Types.ObjectId,required:true, ref:"Category"})
  category: Types.ObjectId;

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type:Date })
  deletedAt: Date;

  @Prop({type:Types.ObjectId, ref:"User"})
  updatedBy:Types.ObjectId;

  @Prop({type:Date})
  restoredAt: Date;
}

export type HsubCategoryDocument =HydratedDocument<subCategory>
export const subCategorySchema = SchemaFactory.createForClass(subCategory);
 subCategorySchema.pre(["updateOne","findOneAndUpdate"],async function (next) {
    const update = this.getUpdate() as UpdateQuery<subCategory> 
    if(update.name){
      update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
    next()
    })
  subCategorySchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
  const query = this.getQuery()
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})
 
export const subCategoryModel = MongooseModule.forFeature([
  {
    name: subCategory.name,
 schema: subCategorySchema
  }
])