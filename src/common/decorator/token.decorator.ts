import { SetMetadata } from "@nestjs/common";
import { UserTokenType } from "../enums";
export const tokenName ="typeToken"

export const token =(typeToken : UserTokenType=UserTokenType.access)=> {
    return SetMetadata(tokenName,typeToken)
   

}