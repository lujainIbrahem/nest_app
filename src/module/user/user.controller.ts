import { Body, Controller,  Patch,  Post, Query, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import {  confirmEmailDTO, loginDTO, resendOtpDTO, signUpDTO } from './DTO/signUpDTO';

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
}
