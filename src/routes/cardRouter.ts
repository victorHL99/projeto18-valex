import { Router } from 'express';

//import from controllers
import cardController from '../controllers/cardController.js'
//import from middlewares
import apiKeyValidate from '../middlewares/apiKeyValidate.js'
import schemaValidate from '../middlewares/schemaValidate.js';

import cardSchema from '../schemas/cardSchema.js';
const cardRouter = Router();

cardRouter.post("/card/create/:IdEmployee", apiKeyValidate, schemaValidate(cardSchema), cardController.createCard);

export default cardRouter;