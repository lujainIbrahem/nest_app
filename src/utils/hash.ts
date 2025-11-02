import * as bcrypt from 'bcrypt';

export const Hash =async  ({plainText ,salt_round = Number(process.env.SALT_ROUND)}:{plainText:string,salt_round?:number} )=>{
    return await bcrypt.hash( plainText ,salt_round);
}

export const Compare = async ({plainText,hash} :{plainText:string,hash:string} )=>{
     return await bcrypt.compare( plainText ,hash);

}

