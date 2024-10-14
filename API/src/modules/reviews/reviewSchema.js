
import Joi from "joi";

export const reviewSchema = Joi.object({
    clientId: Joi.string().required(),
    serviceId: Joi.string().required(),
    reviewDesc: Joi.string().required(),
    rating: Joi.number().required(),
});
