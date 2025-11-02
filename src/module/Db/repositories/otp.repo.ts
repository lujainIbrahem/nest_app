import { Model } from "mongoose";
import { HOtpDocument, Otp } from "../models";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpRepo extends DbRepo<HOtpDocument>{
    constructor(@InjectModel(Otp.name) protected override readonly model: Model<HOtpDocument>){
        super(model)
    }
}