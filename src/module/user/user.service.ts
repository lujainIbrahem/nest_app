import { TokenService } from './../../common/service/token.service';
import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import {  OtpRepo, UserRepo } from '../Db';
import { confirmEmailDTO, loginDTO, resendOtpDTO, signUpDTO } from './signUpDTO';
import { UserGenderEnum, UserOtp, UserRoleEnum } from 'src/common/enums';
import {  generateOTP } from 'src/common';
import { Types } from 'mongoose';
import { Compare } from 'src/utils';


@Injectable()
export class UserService {
    constructor(
         private readonly userRepo: UserRepo,
        private readonly OtpRepo: OtpRepo,
        private tokenService: TokenService
      ){}

private async sendOtp(userId:Types.ObjectId){
    const otp = await generateOTP()
    await this.OtpRepo.create({
        type:UserOtp.confirmEmail,
        code:otp.toString(),
        createdBy:userId,
        expireAt: new Date(Date.now() + 60 * 1000)
    })
        
}

    async signUp(body:signUpDTO){
        const {fName,lName,age,gender,password,email,userName,role}=body
const userExist = await this.userRepo.findOne({ email })

  if (userExist) {
    throw new ConflictException('User already exist');
  }
        const user = await this.userRepo.create({
            fName,
            lName,
            age,
            gender : gender? (gender as UserGenderEnum):UserGenderEnum.male,
            password,
            email,
            userName,
            role: role? (role as UserRoleEnum):UserRoleEnum.user
        })
        if(!user){
            throw new ForbiddenException("User not created")
        }
        await this.sendOtp(user._id)
        return user
    }

    
    async resendOtp(body:resendOtpDTO){
    const {email}=body

   const user = await this.userRepo.findOne(
  { email, confirmed: { $exists: false } }, 
  undefined, 
  { populate: { path: "otp" } } 
)

if (!user) {
  throw new BadRequestException("User not found");
}
    if (await(user.otp as any).length >0) {
    throw new BadRequestException("otp already exist");
}

    await this.sendOtp(user._id)
        return {message :"otp sent success"}

    }

  async confirmEmail(body:confirmEmailDTO){
    const {email ,code}=body
    
    const user = await this.userRepo.findOne(
  { email, confirmed: { $exists: false } },
  undefined,
  { populate: { path: "otp" } }
)

if (!user) {
  throw new BadRequestException("User not found or already exists");
}

  if(!Compare({plainText:code ,hash:(user.otp as any)[0].code })){
    throw new BadRequestException("Invalid otp")
  }

user.confirmed= true
await user.save()
await this.OtpRepo.deleteOne({filter:{createdBy :user._id}})
return {message:"email confirmed"}

}

 async login(body:loginDTO){
    const {email,password}=body
    
    const user = await this.userRepo.findOne(
     {email,confirmed:{$exists:true}}
)

if (!user) {
  throw new BadRequestException("User not found");
}
  if(!await Compare({plainText:password ,hash:user.password }))
  {
      throw new BadRequestException("Invalid password");
  }

    const access_token =await this.tokenService.GenerateToken({
  payload: { userId:user._id ,email: user.email },
   options:{
    secret: user.role === UserRoleEnum.admin? process.env.ACCESS_TOKEN_ADMIN!: process.env.ACCESS_TOKEN_USER!, 
    expiresIn : "1h" 
 }
 });
    
    const refresh_token =await this.tokenService.GenerateToken({
    payload:{ id:user._id , email :user.email },
     options:{
    secret: user.role === UserRoleEnum.admin? process.env.REFRESH_TOKEN_ADMIN!: process.env.REFRESH_TOKEN_USER!,  
      expiresIn : "1y" 
    }
 });

    return {message:"Done",access_token,refresh_token}
    }

}
