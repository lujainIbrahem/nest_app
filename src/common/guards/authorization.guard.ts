import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums';
import { roleName } from '../decorator';

@Injectable()
export class authorizationGuard implements CanActivate {
  constructor( 
    private tokenService: TokenService,
    private reflector: Reflector
){}
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try{

  const req = context.switchToHttp().getRequest()

  const access_Rules :UserRole[] = this.reflector.get(roleName, context.getHandler());
  if(!access_Rules.includes(req.user.role)){
      throw new UnauthorizedException()
  }
     return true;
      }   
     catch (error) {
  throw new BadRequestException(error.message);
    
    }  }
  }


