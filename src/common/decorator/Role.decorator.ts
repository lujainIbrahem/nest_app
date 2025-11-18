import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "../enums";

export const roleName ="access_Rules"
export const Role =(access_Rules :UserRoleEnum[])=> {
    
    return SetMetadata(roleName,access_Rules)
   

}