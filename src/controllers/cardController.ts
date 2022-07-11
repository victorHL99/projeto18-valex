import {Request, Response} from "express";
import cardServices from "../services/cardServices.js";

async function createCard(req: Request, res: Response){
  const {idEmployee, cardType}:{idEmployee:number, cardType:string} = req.body;
  const company:string = res.locals.company;

  const resultVerifyCardCondition:boolean = await cardServices.verifyConditionsCard(idEmployee, cardType, company);
  if(resultVerifyCardCondition === true){
    const resultCreateCard = await cardServices.createCard(idEmployee, cardType, company);
    res.status(200).json(resultCreateCard);
  }

}

const cardController = {
  createCard
}

export default cardController;