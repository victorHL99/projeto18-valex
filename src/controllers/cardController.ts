import {Request, Response} from "express";
import { TransactionTypes } from "../repositories/cardRepository.js"

import cardServices from "../services/cardServices.js";
import * as cardRepository from "../repositories/cardRepository.js"

async function createCard(req: Request, res: Response){
  const {idEmployee, cardType}:{idEmployee:number, cardType:string} = req.body;
  const company:string = res.locals.company;

  const resultVerifyCardCondition:any = await cardServices.verifyConditionsCard(idEmployee, cardType, company);

  if(resultVerifyCardCondition.condition === true){
    const {
      employeeId,
      employeeName,
      email,
      cpf,
      cardType,
      companyId,
      password,
      isVirtual,
      originalCardId
    }:{
      employeeId:number,
      employeeName:string,
      email:string,
      cpf:string,
      cardType:TransactionTypes,
      companyId:number,
      password:string,
      isVirtual:boolean,
      originalCardId:number
    } = resultVerifyCardCondition;
    const resultCreateCard = await cardServices.createCard(
      employeeId,
      employeeName,
      email,
      cpf,
      cardType,
      companyId,
      password,
      isVirtual,
      originalCardId
    );

    await cardRepository.insert(resultCreateCard);
    res.status(200).json(resultCreateCard);
  }

}

async function activeCard(req: Request, res: Response){
  const {cardNumber, securityCode, password}:{cardNumber:string, securityCode:string, password:string} = req.body;
  const cardId:number = parseInt(req.params.cardId);

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCardExpired:any = await cardServices.checkCardExpired(cardId);
  const resultCheckCardIsYours:any = await cardServices.checkCardIsYours(cardId, cardNumber);
  const resultCheckActivedCard:any = await cardServices.checkActivedCard(cardId);
  const resultCheckCvv:any = await cardServices.checkCvv(cardId, securityCode);
  const resultEncryptPassword:any = await cardServices.encryptPassword(password);

  const resultActiveCard:any = await cardServices.activeCard(cardId, resultEncryptPassword);

  res.status(200).json(resultActiveCard);
}

async function getBalanceByCard(req: Request, res: Response){
  const cardId:number = parseInt(req.params.cardId)

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckPayment:any = await cardServices.checkPayment(cardId);
  const resultCheckRecharge:any = await cardServices.checkRecharge(cardId);
  const resultCheckBalance:any = await cardServices.getBalanceByCard(cardId, resultCheckPayment, resultCheckRecharge);

  const finalBalance = {
    balance: resultCheckBalance,
    transactions: resultCheckPayment,
    recharges: resultCheckRecharge
  }
  
  res.status(200).json(finalBalance);
}

async function blockCard(req: Request, res: Response){
  const cardId:number = parseInt(req.params.cardId)
  const password:string = req.body.password;

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckExpired:any = await cardServices.checkCardExpired(cardId);
  const resultCheckCardBlocked:any = await cardServices.checkCardBlocked(cardId);
  const resultCheckCardPassword:any = await cardServices.checkCardPassword(cardId, password);
  const resultBlockedCard:any = await cardServices.blockCard(cardId);

  res.status(200).json("Card blocked");
}

async function unlockCard(req: Request, res: Response){
  const cardId:number = parseInt(req.params.cardId)
  const password:string = req.body.password;

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckExpired:any = await cardServices.checkCardExpired(cardId);
  const resultCheckCardUnlock:any = await cardServices.checkCardUnlock(cardId);
  const resultCheckCardPassword:any = await cardServices.checkCardPassword(cardId, password);
  const resultUnlockCard:any = await cardServices.unlockCard(cardId);

  res.status(200).json("Card unlocked");
}


const cardController = {
  createCard,
  activeCard,
  getBalanceByCard,
  blockCard,
  unlockCard
}

export default cardController;