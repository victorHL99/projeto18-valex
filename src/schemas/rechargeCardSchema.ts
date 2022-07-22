import Joi from 'joi';

const rechargeCardSchema = Joi.object({
  value: Joi.number().min(1).required(),
});

export default rechargeCardSchema;