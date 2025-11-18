import { SetMetadata } from "@nestjs/common";
import { UserTokenTypeEnum } from "../enums";
export const tokenName ="typeToken"

export const token =(typeToken : UserTokenTypeEnum=UserTokenTypeEnum.access)=> {
    return SetMetadata(tokenName,typeToken)
   

}