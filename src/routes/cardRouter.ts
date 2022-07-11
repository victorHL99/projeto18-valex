import { Router } from 'express';

//import from controllers
import cardController from '../controllers/cardController.js'
//import from middlewares
import schemaValidate from '../middlewares/schemaValidate.js';

const cardRouter = Router();

cardRouter.post("/card/create/:IdEmployee", /* apiKeyValidate(), schemaValidate(), */ cardController.createCard);

export default cardRouter;