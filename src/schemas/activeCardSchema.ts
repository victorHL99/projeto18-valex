import Joi from "joi";

const activeCardSchema = Joi.object({
  cardNumber: Joi.string().required(),
  securityCode: Joi.string()/* .pattern(/^[0-9]{3}$/) */.required(),
  password: Joi.string().required(),
})

export default activeCardSchema;