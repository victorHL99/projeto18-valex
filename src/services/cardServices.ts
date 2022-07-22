import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from "cryptr";
import bcrypt from 'bcrypt';

import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

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

async function findCardById(cardId:number){
  const cardExist:any = await cardRepository.findById(cardId);
  if(!cardExist){
    throw {
      status: 404,
      message: "Card not found"
    }
  }

  return {
    CardExist:true
  };
}

async function checkCardExpired(cardId:number){
  const cardExist:any = await cardRepository.findById(cardId);
  const today:any = dayjs().format('MM/YY');
  if(today > cardExist.expirationDate){
    throw {
      status: 400,
      message: "Card expired"
    }
  }
  return {
    CardNotExpired: true
  }
}

async function checkCardIsYours(cardId:number, cardNumber:string){
  const cardExist:any = await cardRepository.findById(cardId);
  const cardNumberRearranged = await organizeCardNumber(cardNumber);
  console.log(cardNumberRearranged);
  console.log(cardExist.number);
  if(cardExist.number !== cardNumberRearranged){
    throw {
      status: 400,
      message: "Card not yours"
    }
  }
  return {
    CardIsYours: true
  }
}

async function organizeCardNumber(value:any){
  value = value.replace(/\D/g, "");
  return value.match(/\d{1,4}/g).join('-');
}

async function checkActivedCard(cardId:number){
  const cardExist:any = await cardRepository.findById(cardId);
  if(cardExist.password !== null){
    throw {
      status: 400,
      message: "Card is actived",
    }
  }
  return {
    CardNotActived: true
  }
}

async function checkCvv(cardId:number, securityCode:string){
  const cryptr = new Cryptr(process.env.SECRET_KEY_CRYPTR);

  const cardExist:any = await cardRepository.findById(cardId);
  const decryptedSecurityCodeDataBase:string = cryptr.decrypt(cardExist.securityCode);
  const decryptedSecurityCode:string = cryptr.decrypt(securityCode);

  console.log(decryptedSecurityCodeDataBase);
  console.log(decryptedSecurityCode);

  if(decryptedSecurityCodeDataBase !== decryptedSecurityCode){
    throw {
      status: 400,
      message: "Security code is not valid"
    }
  }
  return {
    CvvIsValid: true
  }
}

async function encryptPassword(password:string){
  const hashPassword = await bcrypt.hash(password, 10);

  return hashPassword;
}

async function activeCard(cardId:number, resultEncryptPassword:string){
  const cardData:any = await cardRepository.findById(cardId);
  console.log(cardData);
  cardData.password = resultEncryptPassword;
  console.log(cardData);
  await cardRepository.update(cardData.id, cardData);

  return cardData;
  

}

async function checkPayment(cardId:number){
  const checkPayment:any = await paymentRepository.findByCardId(cardId);
  if(!checkPayment){
    throw {
      status: 400,
      message: "Card without payments"
    }
  }
  
  const payments = checkPayment.map((payment:any) => ({
    ...payment,
    timestamp:dayjs(payment.timestamp).format('DD/MM/YYYY')
  }))

  return payments;
}

async function checkRecharge(cardId:number){
  const checkRecharge:any = await rechargeRepository.findByCardId(cardId);
  if(!checkRecharge){
    throw {
      status: 400,
      message: "Card without recharge"
    }
  }

  const recharges = checkRecharge.map((recharge:any) => ({
    ...recharge,
    timestamp:dayjs(recharge.timestamp).format('DD/MM/YYYY')
  }))

  return recharges;
}

async function getBalanceByCard(cardId:number, resultCheckPayment:any, resultCheckRecharge:any){
  let payments = 0;
  let recharges = 0;

  if(resultCheckPayment.length > 0){
    payments = resultCheckPayment.map((payment:any) => payment.amount).reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  if(resultCheckRecharge.length > 0){
    recharges = resultCheckRecharge.map((recharge:any) => recharge.amount).reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  return recharges - payments;
}

async function checkCardBlocked(cardId:number){
  const cardExist:any = await cardRepository.findById(cardId);
  if(cardExist.isBlocked){
    throw {
      status: 400,
      message: "Card already blocked"
    }
  }
  return {
    CardNotBlocked: true
  }
}

async function checkCardPassword(cardId:number, password:string){
  const cardExist:any = await cardRepository.findById(cardId);
  const passwordHash:string = await bcrypt.compare(password, cardExist.password);
  if(!passwordHash){
    throw {
      status: 400,
      message: "Password is not valid"
    }
  }

  return {
    PasswordIsValid: true
  }

}

async function blockCard(cardId:number){
  const cardData:any = await cardRepository.findById(cardId);
  cardData.isBlocked = true;
  await cardRepository.update(cardData.id, cardData);

  return cardData;
}

async function checkCardUnlock(cardId:number){
  const cardExist:any = await cardRepository.findById(cardId);
  if(!cardExist.isBlocked){
    throw {
      status: 400,
      message: "Card already unlocked"
    }
  }
  return {
    CardNotUnlocked: true
  }
}

async function unlockCard(cardId:number){
  const cardData:any = await cardRepository.findById(cardId);
  cardData.isBlocked = false;
  await cardRepository.update(cardData.id, cardData);

  return cardData;
}

async function verifyCardActivedRecharge(cardId:number){
  const cardData:any = await cardRepository.findById(cardId);
  if(cardData.password === null){
    throw {
      status: 400,
      message: "Card not activated"
    }
  }
  return {
    CardActived: true
  }
}

const cardServices = {
  createCard,
  verifyConditionsCard,
  activeCard,
  findCardById,
  checkCardExpired,
  checkCardIsYours,
  checkActivedCard,
  checkCvv,
  encryptPassword,
  checkPayment,
  checkRecharge,
  getBalanceByCard,
  checkCardBlocked,
  checkCardPassword,
  blockCard,
  checkCardUnlock,
  unlockCard,
  verifyCardActivedRecharge
}

export default cardServices;