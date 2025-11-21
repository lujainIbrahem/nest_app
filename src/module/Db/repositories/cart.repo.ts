import { Model } from "mongoose";
import { HCartDocument, Cart } from "../models";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CartRepo extends DbRepo<HCartDocument>{
    constructor(@InjectModel(Cart.name) protected override readonly model: Model<HCartDocument>){
        super(model)
    }
}