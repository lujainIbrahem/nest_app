import { OtpRepo } from './../Db/repositories/otp.repo';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModel, UserModel } from '../Db/models';
import { UserRepo } from '../Db';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[UserModel,OtpModel],
  controllers:[UserController],
  providers: [UserService,UserRepo,OtpRepo,JwtService]
})
export class UserModule {}
