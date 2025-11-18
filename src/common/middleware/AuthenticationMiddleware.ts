

import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import {  Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { UserReq } from '../interfaces';
import { UserTokenTypeEnum } from '../enums';

export const tokenType =(typeToken:UserTokenTypeEnum=UserTokenTypeEnum.access)=>{
    return  (req: UserReq, res: Response, next: NextFunction)=>{
    req.typeToken=typeToken
    next()
    }
}


@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
    private readonly tokenService:TokenService

    ){}
  async use(req: UserReq, res: Response, next: NextFunction) {
try {
 const { authorization }= req.headers
var [prefix,token ] =authorization?.split(" ") || [] 
if(!prefix || !token)
    {
  throw new BadRequestException("token not exit");
}
const signature = await this.tokenService.GetSignature(prefix,req.typeToken)
if(!signature){
    throw new BadRequestException("Invalid token");

}

const decoded = await this.tokenService.decodedAndFetched(token,signature)

req.user =decoded?.user
req.decoded =decoded?.decoded

   return next();
  }   
 catch (error) {
        throw new BadRequestException(error.message);

}
  }
}
