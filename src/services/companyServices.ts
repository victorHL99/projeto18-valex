import * as companyRepository from "../repositories/companyRepository.js"

async function findApiKey(apiKey:string){
  const resultFindApiKey = await companyRepository.findByApiKey(apiKey);
  if(!resultFindApiKey){
    throw {
      status: 404,
      message: "Api key not found"
    }
  }
  return resultFindApiKey;
} 
const companyServices = {
  findApiKey
}

export default companyServices;