import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepo } from "src/module/Db";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayload } from "jsonwebtoken";
import { UserTokenType } from "../enums";


@Injectable()
export class TokenService {
    constructor(
    private readonly userRepo: UserRepo,
    private jwtService: JwtService
    ){}
    
    GenerateToken = async ({payload,options}:{
    payload:object,
    options?:JwtSignOptions
}):Promise<string>=>{
    return this.jwtService.signAsync( payload,options);
}

  VerifyToken = async ({token ,options}:{
    token:string
    ,options:JwtVerifyOptions
}):Promise<JwtPayload>=>{
    return  this.jwtService.verifyAsync( token ,options) 
}


GetSignature =async (prefix: string, tokenType: UserTokenType = UserTokenType.access) => {

if(tokenType ===UserTokenType.access)
    {if (prefix == "user"){
return process.env.ACCESS_TOKEN_USER}

else if(prefix =="admin"){
  return process.env.ACCESS_TOKEN_ADMIN
}
else{return null}
    }

if(tokenType ===UserTokenType.refresh)
    {if (prefix == "user"){
return process.env.REFRESH_TOKEN_USER}

else if(prefix =="admin"){
  return process.env.REFRESH_TOKEN_ADMIN
}
else{return null}
    }
    return null

}


 decodedAndFetched =async(token:string,signature:string) =>{

const decoded =await this.VerifyToken({token, options:{secret:signature}});

if(!decoded) { throw new BadRequestException("not decoded") }

const user = await this.userRepo.findOne({email: decoded.email})

if(!user){
  throw new BadRequestException("user not exit");
}

if(!user?.confirmed){
  throw new BadRequestException("user not confirmed");
}
 /*
if(await this.findOne({tokenId:decoded?.jti!})){
  throw new BadRequestException("token has been revoked");
}
if(user?.changeCredentails?.getTime()! >decoded?.iat! *1000 ){
      throw new BadRequestException("token has been revoked");

}
*/
return{decoded,user}
}

}







