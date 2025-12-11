import { Model } from "mongoose";
import { HCouponDocument, Coupon } from "../models";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CouponRepo extends DbRepo<HCouponDocument>{
    constructor(@InjectModel(Coupon.name) protected override readonly model: Model<HCouponDocument>){
        super(model)
    }
}