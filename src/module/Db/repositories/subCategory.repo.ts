import { Model } from "mongoose";
import { DbRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { subCategory, HsubCategoryDocument } from "../models/subCategory.model";

@Injectable()
export class subCategoryRepo extends DbRepo<HsubCategoryDocument>{
    constructor(@InjectModel(subCategory.name) protected override readonly model: Model<HsubCategoryDocument>){
        super(model)
    }
}