import { Router } from 'express';

import rechargeController from '../controllers/rechargeController.js';

import apiKeyValidate from '../middlewares/apiKeyValidate.js';
import schemaValidate from '../middlewares/schemaValidate.js';

import rechargeCardSchema from '../schemas/rechargeCardSchema.js';

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:cardId", apiKeyValidate, schemaValidate(rechargeCardSchema), rechargeController.createRecharge)

export default rechargeRouter;