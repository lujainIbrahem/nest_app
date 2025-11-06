import { OtpRepo } from './../Db/repositories/otp.repo';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModel, UserModel } from '../Db/models';
import { UserRepo } from '../Db';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.service';
import {  RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AuthenticationMiddleware, tokenType } from 'src/common/middleware';

@Module({
  imports:[UserModel,OtpModel],
  controllers:[UserController],
  providers: [UserService,UserRepo,OtpRepo,JwtService,TokenService]
})
export class UserModule {
 // configure(consumer: MiddlewareConsumer) {
   // consumer
     // .apply(tokenType(),AuthenticationMiddleware)
      //.forRoutes({ path: 'user/*demo', method: RequestMethod.GET });
  //}
}



