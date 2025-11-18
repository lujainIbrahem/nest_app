import { DeleteResult, HydratedDocument, QueryOptions, Types, UpdateQuery } from "mongoose";
import { UpdateWriteOpResult } from "mongoose";
import { Model, ProjectionType, RootFilterQuery } from "mongoose";

export class DbRepo<TDocument>{
    constructor(protected readonly model:Model<TDocument>){}
     
    async create(data:Partial<TDocument>) : Promise<HydratedDocument<TDocument>>{
    return this.model.create(data)
    }

async find(
  {
    filter,
   select,
   options
}:{
  
    filter: RootFilterQuery<TDocument>,
   select?: ProjectionType<TDocument>,
   options?: QueryOptions<TDocument>
})
   :
    Promise<HydratedDocument<TDocument>[]> {
  return this.model.find(filter,select,options)
}

async paginate(
  {
  filter,
  query,
  select,
  options
}:{
  filter: RootFilterQuery<TDocument>,
  query:{page : number ,limit : number },
  select?: ProjectionType<TDocument>,
  options?: QueryOptions<TDocument>
}
){
  let {page ,limit } = query
  if(page < 0) page = 1
  page = page * 1 || 1
  const skip = (page - 1) * limit
  const finalOptions = {
    ...options,skip,limit
  }
  const count = await this.model.countDocuments({deletedAt:{$exists:false}})
  const numberOfPages = Math.ceil(count/limit)
  const document = await this.model.find(filter,select,finalOptions)

  return {document , numberOfPages , cuttentPage :page ,countDocument:count }
}

 async findOne(filter: RootFilterQuery<TDocument>, projection?: ProjectionType<TDocument>, options?: QueryOptions<TDocument>) {
  return await this.model.findOne(filter, projection, options);
}


    async updateOne(filter:RootFilterQuery<TDocument>, update:UpdateQuery<TDocument>) : Promise<UpdateWriteOpResult>{
    return await this.model.updateOne(filter,update)
    }
    
  async findOneAndUpdate(
    {
    filter,
    update,
    options
  }:{
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument> 
}
):Promise<TDocument | null>
    {
      return await this.model.findOneAndUpdate(filter, update, {new:true})
    }
    
  async findOneAndDelete(
  {
    filter
  }:{
    filter: RootFilterQuery<TDocument>
}
):Promise<TDocument | null>
{
  return await this.model.findOneAndDelete(filter)
}


   async findById(id:Types.ObjectId | string, projection?:ProjectionType<TDocument>,options?:QueryOptions<TDocument>) :
    Promise<HydratedDocument<TDocument> | null>{
    return await this.model.findById(id,projection,options)
    }

    
   async deleteOne(filter:RootFilterQuery<TDocument>) :Promise<DeleteResult>{
    return await this.model.deleteOne(filter)
    }


}