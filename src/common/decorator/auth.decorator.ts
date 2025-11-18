import { applyDecorators, UseGuards } from '@nestjs/common';
import { token } from './token.decorator';
import { Role } from './Role.decorator';
import { UserRoleEnum, UserTokenTypeEnum } from '../enums';
import { AuthenticationGuard, authorizationGuard } from '../guards';

export function Auth(
    {
      roles,
      typeToken
      }:
    {
      roles:UserRoleEnum[],
      typeToken:UserTokenTypeEnum,
    } ) {
return applyDecorators(
  Role(roles),
  token(typeToken),
  UseGuards(AuthenticationGuard,authorizationGuard)
);
}
