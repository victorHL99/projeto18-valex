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
  const password:string = req.body.password;
  const id:number = req.locals.card.id;
}

const cardController = {
  createCard,
  activeCard
}

export default cardController;