import { faker } from '@faker-js/faker';

import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"

import {generateCardName} from "./employeeServices.js"



async function verifyConditionsCard(idEmployee:number, cardType:any, company:any){
  //verify card exist by idEmployee and cardType
  const cardExist:any = await cardRepository.findByTypeAndEmployeeId(cardType, idEmployee);
  if(cardExist){
    throw {
      status: 400,
      message: "Card already exists"
    }
  }

  //verify if employee exist
  const employeeExist:any = await employeeRepository.findById(idEmployee);
  console.log(employeeExist);
  if(!employeeExist){
    throw {
      status: 404,
      message: "Employee not found"
    }
  }

  //verify if employee is from this company
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
  cardType:string,
  companyId:number,
  password:string,
  isVirtual:boolean,
  originalCardId:number){

    const cardName:string = await generateCardName(employeeName);
    console.log(cardName);
    const cardNumber:string = faker.finance.creditCardNumber('63[7-9]#-####-####-###L')
    console.log(cardNumber);

}

const cardServices = {
  createCard,
  verifyConditionsCard
}

export default cardServices;