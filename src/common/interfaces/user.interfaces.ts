import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserTokenTypeEnum } from "../enums";
import { HUserDocument } from "src/module/Db";

export interface UserReq extends Request{
    user:HUserDocument;
    decoded:JwtPayload;
    typeToken:UserTokenTypeEnum
}