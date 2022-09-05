import {Request, Response} from "express";

import cardServices from '../services/cardServices.js';
import businessServices from '../services/businessServices.js';
import paymentsServices from '../services/paymentsServices.js';

import cardController from '../controllers/cardController.js';
import {PaymentInsertData} from "../repositories/paymentRepository.js"

async function createPayment(req: Request, res:Response){
  const cardId:number = parseInt(req.params.cardId);
  const paymentData:any = req.body;

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckCardActived:any = await cardServices.verifyCardActivedRecharge(cardId);
  const resultCheckCardExpire:any = await cardServices.checkCardExpired(cardId);
  const resultCheckCardIsBlocked:any = await cardServices.checkCardBlocked(cardId);
  const resultCheckCardPassword:any = await cardServices.checkCardPassword(cardId, paymentData.password);
  const resultCheckValidateBusiness:any = await businessServices.validateBusiness(paymentData.businessId);
  const resultCheckTypesBusiness:any = await businessServices.validateTypesBusiness(cardId, resultCheckValidateBusiness.type);
  const resultCheckCardBalance:any = await paymentsServices.validateBalance(cardId);
  const resultCheckValidateBuy:any = await paymentsServices.validateBuy(resultCheckCardBalance.balance, paymentData.amount);

  const resultCreateBuy:any = await paymentsServices.createBuy(paymentData.cardId, paymentData.businessId, paymentData.amount);

  res.status(200).send({
    message: "Payment created"
  });

}

const paymentController = {
  createPayment

}

export default paymentController;