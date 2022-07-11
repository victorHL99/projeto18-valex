import {Request, Response, NextFunction} from "express";
import companyServices from "../services/companyServices.js";

export default async function apiKeyValidate(req: Request, res: Response, next: NextFunction){
  const apiKey:string = req.header('x-api-key');
  if(!apiKey){
    throw {
      status: 401,
      message: "Api key not found"
    }
  }

  const companyKey = await companyServices.findApiKey(apiKey);

  res.locals.company = companyKey;

  next();
}
