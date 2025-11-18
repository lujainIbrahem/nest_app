import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModel, UserModel } from '../Db/models';
import { OtpRepo, UserRepo } from '../Db';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.service';

@Module({
  imports:[UserModel,OtpModel],
  controllers:[UserController],
  providers: [UserService,UserRepo,OtpRepo,TokenService,JwtService],
})

export class UserModule {}



