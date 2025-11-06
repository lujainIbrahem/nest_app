import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/module/Db";
import { UserTokenType } from "../enums";

export interface UserReq extends Request{
    user:HUserDocument;
    decoded:JwtPayload;
    typeToken:UserTokenType
}