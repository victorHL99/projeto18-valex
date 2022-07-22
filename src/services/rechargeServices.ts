import * as rechargeRepository from '../repositories/rechargeRepository.js';

async function createRecharge(rechargeData:any){
  const { cardId, amount }:{cardId:number, amount:number} = rechargeData;
  await rechargeRepository.insert({cardId, amount});
  return {
    message: `${amount}`
  }
}
const rechargeServices = {
  createRecharge
};

export default rechargeServices;