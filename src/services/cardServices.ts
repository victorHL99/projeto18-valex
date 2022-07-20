import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from "cryptr";

import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"

import {generateCardName} from "./employeeServices.js"
import { TransactionTypes } from "../repositories/cardRepository.js"

async function generateExpireDate(){
  return dayjs().add(5, 'year').format('MM/YY');
}

async function verifyConditionsCard(idEmployee:number, cardType:any, company:any){
  const cardExist:any = await cardRepository.findByTypeAndEmployeeId(cardType, idEmployee);
  if(cardExist){
    throw {
      status: 400,
      message: "Card already exists"
    }
  }

  const employeeExist:any = await employeeRepository.findById(idEmployee);
  console.log(employeeExist);
  if(!employeeExist){
    throw {
      status: 404,
      message: "Employee not found"
    }
  }

  if(employeeExist.companyId !== company.id){
    throw {
      status: 401,
      message: "Employee not from this company"
    }
  }

  return {
    condition: true,
    employeeId: idEmployee,
    employeeName: employeeExist.fullName,
    email: employeeExist.email,
    cpf: employeeExist.cpf,
    cardType: cardType,
    companyId: company.id,
    password: null,
    isVirtual: false,
    originalCardId: null
  };
}

async function createCard( 
  employeeId:number,
  employeeName:string,
  email:string,
  cpf:string,
  cardType:TransactionTypes,
  companyId:number,
  password:string,
  isVirtual:boolean,
  originalCardId:number){

    const cryptr = new Cryptr(process.env.SECRET_KEY_CRYPTR);

    const cardName:string = await generateCardName(employeeName);
    const cardNumber:string = faker.finance.creditCardNumber('63[7-9]#-####-####-###L')
    const expireDate:string =  await generateExpireDate();
    const cvv:string = faker.finance.creditCardCVV();
    const cvvEncrypted:string = cryptr.encrypt(cvv);



    return {
      employeeId: employeeId,
      cardholderName: cardName,
      number: cardNumber,
      expirationDate: expireDate,
      securityCode: cvvEncrypted,
      password: null,
      isVirtual: false,
      originalCardId: null,
      isBlocked: false,
      type: cardType,
    }


}

async function activeCard(){

}

const cardServices = {
  createCard,
  verifyConditionsCard,
  activeCard
}

export default cardServices;