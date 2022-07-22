import {Router} from 'express';

import paymentController from '../controllers/paymentController.js';

import schemaValidate from '../middlewares/schemaValidate.js';

import paymentSchema from '../schemas/paymentSchema.js';

const paymentsRouter = Router();

paymentsRouter.post("/payments/:cardId",schemaValidate(paymentSchema), paymentController.createPayment);

export default paymentsRouter;