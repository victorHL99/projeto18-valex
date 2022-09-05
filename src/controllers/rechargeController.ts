import {Request, Response} from "express";

import cardServices from '../services/cardServices.js';
import rechargeServices from '../services/rechargeServices.js';


async function createRecharge(req: Request, res: Response){
  const {value}:{value:number} = req.body;
  const cardId:number = parseInt(req.params.cardId);
  const rechargeData:any ={
    cardId: cardId,
    amount: value
  }

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckCardActived:any = await cardServices.verifyCardActivedRecharge(cardId);
  const resultCheckCardExpire:any = await cardServices.checkCardExpired(cardId);
  const resultCreateRecharge:any = await rechargeServices.createRecharge(rechargeData);

  res.status(200).send(`Recharge performed, value entered is: $${resultCreateRecharge.message},00`);
}

const rechargeController = {
  createRecharge
}

export default rechargeController;