import { Model } from "mongoose";
import { HBrandDocument, Brand } from "../models";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BrandRepo extends DbRepo<HBrandDocument>{
    constructor(@InjectModel(Brand.name) protected override readonly model: Model<HBrandDocument>){
        super(model)
    }
}