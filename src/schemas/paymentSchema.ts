import Joi from 'joi';

const paymentSchema = Joi.object({
  cardId: Joi.number().required(),
  password: Joi.string().pattern(/^[0-9]{4}$/).required(),
  businessId: Joi.number().required(),
  amount: Joi.number().required().min(1),
})

export default paymentSchema;