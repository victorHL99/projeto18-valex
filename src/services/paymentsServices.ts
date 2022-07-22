import * as businessRepository from '../repositories/businessRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

import cardServices from '../services/cardServices.js';

async function validateBalance(cardId:number){

  const resultCheckCardId:any = await cardServices.findCardById(cardId);
  const resultCheckPayment:any = await cardServices.checkPayment(cardId);
  const resultCheckRecharge:any = await cardServices.checkRecharge(cardId);
  const resultCheckBalance:any = await cardServices.getBalanceByCard(cardId, resultCheckPayment, resultCheckRecharge);

  const finalBalance = {
    balance: resultCheckBalance,
    transactions: resultCheckPayment,
    recharges: resultCheckRecharge
  }
  
  
  return finalBalance;
}

async function validateBuy(payment:number, amount:number){
  if(payment - amount < 0){
    throw {
      status: 400,
      message: "Not enough balance"
    }}
}

async function createBuy(cardId:number,businessId:number,amount:number){
  const paymentData = {
    cardId,
    businessId,
    amount
  }
  const resultByInsertBuy:any = await paymentRepository.insert(paymentData);

}

const paymentsServices = {
  validateBalance,
  validateBuy,
  createBuy
};

export default paymentsServices;