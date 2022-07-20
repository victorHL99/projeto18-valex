import { Router } from 'express';

//import from controllers
import cardController from '../controllers/cardController.js'
//import from middlewares
import apiKeyValidate from '../middlewares/apiKeyValidate.js'
import schemaValidate from '../middlewares/schemaValidate.js';

import cardSchema from '../schemas/cardSchema.js';
import activeCardSchema from '../schemas/activeCardSchema.js';

const cardRouter = Router();

cardRouter.post("/card/create", apiKeyValidate, schemaValidate(cardSchema), cardController.createCard);
cardRouter.put("/card/active/:cardId", schemaValidate(activeCardSchema), cardController.activeCard);

export default cardRouter;