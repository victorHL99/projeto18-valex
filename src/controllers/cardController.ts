import {Request, Response} from "express";

async function createCard(req: Request, res: Response){
  return res.send("createCard");

}

const cardController = {
  createCard
}

export default cardController;