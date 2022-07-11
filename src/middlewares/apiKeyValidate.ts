import {Request, Response, NextFunction} from "express";
import companyServices from "../services/companyServices.js";

async function apiKeyValidate(req: Request, res: Response, next: NextFunction){
  const apiKey = req.headers("x-api-key");

  const verifyKeyByCompany = await companyServices.findApiKey(apiKey.toString());

  res.locals.company = verifyKeyByCompany;

  next();
}