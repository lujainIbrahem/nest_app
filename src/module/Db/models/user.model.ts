    
import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserGenderEnum, UserProviderEnum, UserRoleEnum } from 'src/common/enums';
import type{ HOtpDocument } from './otp.model';
import { Hash } from 'src/utils';

@Schema({timestamps:true, toObject:{virtuals:true}, toJSON:{virtuals:true},strictQuery:true})

export class User {
  @Prop({type:String,required:true,minlength:2,trim:true})
  fName: string;
  @Prop({type:String,required:true,minlength:2,trim:true})
  lName: string;
  @Virtual({
    get(){
        return `${this.fName} ${this.lName}`
    },
    set(v){
        this.fName= v.split(' ')[0]
        this.lName= v.split(' ')[0]
    }
  })
  userName: string;
  @Prop({type:Number,min:18,max:60, required: true })
  age: number;
  @Prop({type:String,required:true,unique:true,trim:true})
  email: string;
  @Prop({type:String, trim:true,required: true})
  password: string;
  @Prop({type:Boolean})
  confirmed: boolean; 
  @Prop({type:String, enum:UserGenderEnum, default:UserGenderEnum.male})
  gender: UserGenderEnum;
  @Prop({type:String, enum:UserRoleEnum, default:UserRoleEnum.user})
  role: UserRoleEnum;
  @Prop({type :[{type:Types.ObjectId, ref:"Product"}]})
  wishList: Types.ObjectId[];
  @Prop({type:Date,default:Date.now})
  changeCredentails: Date;
  @Prop({type:String, enum:UserProviderEnum, default:UserProviderEnum.system})
  provider: UserProviderEnum;
  @Virtual()
  otp:HOtpDocument[]
}

export const UserSchema = SchemaFactory.createForClass(User);
export type HUserDocument =HydratedDocument<User>

UserSchema.virtual("otp",{
  ref:"Otp",
  localField:"_id",
  foreignField:"createdBy"
})

export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory:()=>{
      UserSchema.pre("save",async function (next) {
        if(this.isModified("password")){
        this.password = await Hash({plainText:this.password});
        }
        next()
      })
    
    return UserSchema
  }
 }])
 