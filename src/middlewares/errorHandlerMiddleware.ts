import {Request, Response, NextFunction} from "express";

export default function errorHandler (error, req: Request, res: Response, next: NextFunction) {
  console.log("vixii");
  console.log(error.status);

  if(error){
    res.status(error.status).send(error.message);
  }

  res.sendStatus(500); // internal server error
}