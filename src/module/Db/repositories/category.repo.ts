import { Model } from "mongoose";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Category, HCategoryDocument } from "../models/category.model";

@Injectable()
export class CategoryRepo extends DbRepo<HCategoryDocument>{
    constructor(@InjectModel(Category.name) protected override readonly model: Model<HCategoryDocument>){
        super(model)
    }
}