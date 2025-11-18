import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../enums';
import { roleName } from '../decorator';

@Injectable()
export class authorizationGuard implements CanActivate {
  constructor( 
    private reflector: Reflector
){}
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try{

  const req = context.switchToHttp().getRequest()
  const access_Rules :UserRoleEnum[] = this.reflector.get(roleName, context.getHandler());
  if(!access_Rules.includes(req.user.role)){
      throw new UnauthorizedException()
  }
     return true;
      }   
     catch (error) {
  throw new BadRequestException(error.message);
    }  }
  }


