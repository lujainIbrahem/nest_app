import { tokenType } from './../../common/middleware/AuthenticationMiddleware';
import { Body, Controller,  Get,  ParseFilePipe,  Patch,  Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import {  confirmEmailDTO, loginDTO, resendOtpDTO, signUpDTO } from './signUpDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerlocal } from 'src/utils';
import{ Auth, User, UserRoleEnum, UserTokenTypeEnum } from 'src/common';
import type{ HUserDocument } from '../Db';


@Controller('user')
export class UserController {

constructor(private readonly userService :UserService){}

@Post("signUp")
signUp(
    @Body() body:signUpDTO,
){
    return this.userService.signUp(body)
}

@Post("resendOtp")
resendOtp(
    @Body() body:resendOtpDTO,
){
    return this.userService.resendOtp(body)
}
    

@Patch("confirmEmail")
confirmEmail(
    @Body() body:confirmEmailDTO,
){
    return this.userService.confirmEmail(body)
}


@Post("login")
login(
    @Body() body:loginDTO,
){
    return this.userService.login(body)
}


@Auth({
    roles:[UserRoleEnum.user],
    typeToken:UserTokenTypeEnum.access
})
@Get("profile")
profile(
    @User() user:HUserDocument,
){
    return {message:"done" , user}
}



@Post('upload')
@UseInterceptors(FileInterceptor('attachment' , multerlocal({fileTypes:["image/jpeg","image/png"]})))
uploadFile(@UploadedFile(new ParseFilePipe({})) file: Express.Multer.File) {
return {message:"done",file}
}



}
