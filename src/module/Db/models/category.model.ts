import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class Category {
  @Prop({type:String,required:true,minlength:2,maxLength:50,trim:true,unique:true})
   name: string;

  @Prop({type:String,required:true,minlength:2,maxLength:30,trim:true})
   slogan: string;

  @Prop({type:String,default:function (){return slugify(this.name,{replacement:"-",lower:true,trim:true})}})
   slug: string;

  @Prop({type:String})
  image: string;

  @Prop({type:Types.ObjectId, ref:"Brand"})
  brands: Types.ObjectId[];

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type:Date })
  deletedAt: Date;

  @Prop({type:Types.ObjectId, ref:"User"})
  updatedBy:Types.ObjectId;

  @Prop({type:Date})
  restoredAt: Date;
}

export type HCategoryDocument =HydratedDocument<Category>
export const CategorySchema = SchemaFactory.createForClass(Category);
 CategorySchema.pre(["updateOne","findOneAndUpdate"],async function (next) {
    const update = this.getUpdate() as UpdateQuery<Category> 
    if(update.name){
      update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
    next()
    })
  CategorySchema.pre(["findOne","find","findOneAndDelete","findOneAndDelete"],function (next) {
  const query = this.getQuery()
const {paranoid , ...rest} =query
if (paranoid === false){
  this.setQuery({...rest })
} else {
  this.setQuery({...rest, deletedAt:{$exists:false}})
}
  next()
})
 
export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
 schema: CategorySchema
  }
])