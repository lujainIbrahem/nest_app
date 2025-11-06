import { Body, Controller,  Get,  ParseFilePipe,  Patch,  Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import {  confirmEmailDTO, loginDTO, resendOtpDTO, signUpDTO } from './DTO/signUpDTO';
import type { UserReq } from 'src/common/interfaces';
import { AuthenticationGuard } from 'src/common/guards';
import { Role, token, UserRole } from 'src/common';
import { authorizationGuard } from 'src/common/guards/authorization.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerlocal } from 'src/utils';

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

@token()
@UseGuards(AuthenticationGuard, authorizationGuard)
@Role([UserRole.user])
@Get("profile")
profile(
    @Request() req:UserReq,
){
    return {message:"done" , user:req.user}
}



@Post('upload')
@UseInterceptors(FileInterceptor('attachment' , multerlocal({fileTypes:["image/jpeg","image/png"]})))
uploadFile(@UploadedFile(new ParseFilePipe({})) file: Express.Multer.File) {
return {message:"done",file}
}



}
