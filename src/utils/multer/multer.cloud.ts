import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import multer from "multer"
import { storageEnum } from "src/common"
import { fileValidation } from "./multer.filevalidation"
import os from "os"

export const multercloud =({
fileTypes = fileValidation.image,
storageType = storageEnum.cloud,
}: {
    fileTypes?:string[],
    storageType?:storageEnum,
})=>{
    return{
    storage : storageType === storageEnum.cloud? multer.memoryStorage() :multer.diskStorage({
    destination: os.tmpdir(), 
    filename(req:Request, file:Express.Multer.File, cb:Function){
  cb(null,`${Date.now()}-${file.originalname}`)

    }
}),

 fileFilter :(req:Request, file:Express.Multer.File, cb:Function)=> {

  if(!fileTypes.includes(file.mimetype)){
  return cb(new BadRequestException("Invalid file"))
  }else{
  return cb(null,true)

  }
}
    }
}