import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { tokenName } from '../decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor( 
    private tokenService: TokenService,
    private reflector: Reflector
){}
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
try{
    const tokenType = this.reflector.get(tokenName, context.getHandler());

    let req:any;
    let authorization:string =""

    if(context.getType() === "http"){
     req = context.switchToHttp().getRequest()
     authorization = req.headers.authorization
    }
    var [prefix,token ] =authorization?.split(" ") || [] 
    if(!prefix || !token)
        {
      throw new BadRequestException("token not exit");
    }
    const signature = await this.tokenService.GetSignature(prefix)
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