import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eventEmiiter } from 'src/common';
import {  UserOtp } from 'src/common/enums';
import { Hash } from 'src/utils/hash';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class Otp {

  @Prop({type:String,required:true, trim:true})
  code: string;

  @Prop({type:Types.ObjectId,required:true, ref:"User"})
  createdBy: Types.ObjectId;

  @Prop({type:String,enum:UserOtp, required: true })
  type: UserOtp;

  @Prop({type:Date,required:true})
  expireAt: Date;

}

export type HOtpDocument =HydratedDocument<Otp>

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({expireAt:1},{expireAfterSeconds:0})


 OtpSchema.pre("save",async function (this: HOtpDocument &{is_new:boolean , plain_code:string},next) {
          if(this.isModified("code")){
            this.plain_code =this.code
            this.is_new = this.isNew
            this.code = await Hash({plainText: this.code})
            await this.populate([
                {
                path:"createdBy",
                select:"email"
                }
            ])
        }
          next()
        })
   
   
 OtpSchema.post("save",async function (doc,next) {
    const that = this as HOtpDocument & {is_new:boolean , plain_code:string}
    if(that.is_new){
        eventEmiiter.emit(doc.type , {otp:that.plain_code , email:(doc.createdBy as any).email})  
    }
        next()
    })
   

export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
 schema: OtpSchema
  }
])