import { tokenType } from './../middleware/AuthenticationMiddleware';
import { BadRequestException, CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { Reflector } from '@nestjs/core';
import { tokenName } from '../decorator';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
    private reflector: Reflector
  ){}
  
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const typetoken = this.reflector.get(tokenName, context.getHandler());
    let req:any;
    let authorization:string =""

    if(context.getType() === "http"){
     req = context.switchToHttp().getRequest()
     authorization = req.headers.authorization
    }
    try{
      
    var [prefix,token ] =authorization?.split(" ") || [] 
    if(!prefix || !token)
        {
      throw new BadRequestException("token not exit");
    }
    const signature = await this.tokenService.GetSignature(prefix,typetoken)
    if(!signature){
        throw new BadRequestException("Invalid token");
    
    }
    const decoded = await this.tokenService.decodedAndFetched(token,signature)
    
    req.user =decoded?.user
    req.decoded =decoded?.decoded
    
       return true;
       }
     catch (error) {
      throw new BadRequestException(error.message);
    
      }

    }}