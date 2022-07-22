import * as businessRepository from '../repositories/businessRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';

import cardServices from '../services/cardServices.js';

async function validateBusiness(businessId:number){
  const businessExist:any = await businessRepository.findById(businessId);
  if(!businessExist){
    throw new Error("Business not found");
  }

  return businessExist;
}

async function validateTypesBusiness(cardId:number, businessType:string){
  const cardData:any = await cardRepository.findById(cardId);
  if(cardData.type !== businessType){
    throw {
      status: 400,
      message: "Card type not match with business type"
    }
  }
}



const businessServices = {
  validateBusiness,
  validateTypesBusiness
};

export default businessServices;