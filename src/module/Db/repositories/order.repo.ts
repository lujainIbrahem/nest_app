import { Model } from "mongoose";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { HOrderDocument, Order } from "../models";

@Injectable()
export class OrderRepo extends DbRepo<HOrderDocument>{
    constructor(@InjectModel(Order.name) protected override readonly model: Model<HOrderDocument>){
        super(model)
    }
}