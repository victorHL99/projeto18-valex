import Joi from 'joi';

const blockCardSchema = Joi.object({
  password: Joi.string().required().length(4),
})

export default blockCardSchema;