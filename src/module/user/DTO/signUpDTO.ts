import { email } from './../../../../node_modules/zod/src/v4/core/regexes';
import {  IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Length, Matches, Max, Min, ValidateIf } from "class-validator"
import { IsMatch } from "src/common/decorator";
import { UserGender } from "src/common/enums";


export class resendOtpDTO{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string
}
export class loginDTO{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

    @IsStrongPassword()
    @IsNotEmpty({message:"password is required"})
    password:string

}

export class confirmEmailDTO{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

 @IsNotEmpty()
    @IsString()
    @Matches(/^\d{6}$/)
    code:string

}



export class signUpDTO{
        @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string
    
    @IsString({message:"name must be string"})
    @IsNotEmpty({message:"name is required"})
    @Length(3, 15, { message: "name must be between 3 to 15 characters" })
    @ValidateIf((data:signUpDTO)=>{ return Boolean(!data.userName)})
    fName:string
    
    @IsString({message:"name must be string"})
    @IsNotEmpty({message:"name is required"})
    @Length(3, 15, { message: "name must be between 3 to 15 characters" })
    @ValidateIf((data:signUpDTO)=>{ return Boolean(!data.userName)})
    lName:string

    @IsString()
    @IsNotEmpty()
    @Length(3,25)
    @ValidateIf((data:signUpDTO)=>{ return Boolean(!data.fName && !data.lName)})
    userName:string

    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Max(70)
    age:number



    @IsOptional()
    @IsEnum(UserGender)
    gender?:string

    @IsStrongPassword()
    @IsNotEmpty({message:"password is required"})
    password:string

    @IsMatch(["password"])
    @ValidateIf((data:signUpDTO)=>{ return Boolean(data.password)})
    cPassword:string
}

