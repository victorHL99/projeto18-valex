import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"

async function verifyConditionsCard(idEmployee:number, cardType:any, company:any){
  //verify card exist by idEmployee and cardType
  const cardExist:any = await cardRepository.findByTypeAndEmployeeId(cardType, idEmployee);
  if(cardExist.length > 0){
    throw {
      status: 400,
      message: "Card already exists"
    }
  }

  //verify if employee exist
  const employeeExist:any = await employeeRepository.findById(idEmployee);
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

  return true;
}

async function createCard(idEmployee:number, cardType:string, company:any){

}

const cardServices = {
  createCard,
  verifyConditionsCard
}

export default cardServices;