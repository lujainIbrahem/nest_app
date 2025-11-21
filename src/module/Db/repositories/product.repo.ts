import { Model } from "mongoose";
import { HProductDocument, Product } from "../models";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepo extends DbRepo<HProductDocument>{
    constructor(@InjectModel(Product.name) protected override readonly model: Model<HProductDocument>){
        super(model)
    }
}