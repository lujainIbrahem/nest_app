import { SetMetadata } from "@nestjs/common";
import { UserRole, UserTokenType } from "../enums";

export const roleName ="access_Rules"
export const Role =(access_Rules :UserRole[])=> {
    
    return SetMetadata(roleName,access_Rules)
   

}