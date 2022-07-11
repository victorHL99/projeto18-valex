import {Request, Response} from "express";
import cardServices from "../services/cardServices.js";

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
      cardType:string,
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
    res.status(200).json(resultCreateCard);
  }

}

const cardController = {
  createCard
}

export default cardController;