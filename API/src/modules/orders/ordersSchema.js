
import Joi from "joi";

export const orderSchema = Joi.object({
    orderImage_url: Joi.string().required(),
    freelancerId: Joi.string().required(),
    clientId: Joi.string().required(),
    orderTitle: Joi.string().required(),
    orderPrice: Joi.number().required(),
    requestId: Joi.string().required(),
    serviceId : Joi.string().required()
});
